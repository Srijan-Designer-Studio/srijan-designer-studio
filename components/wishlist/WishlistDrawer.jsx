// components/wishlist/WishlistDrawer.jsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { X, Trash2, ShoppingCart, Loader2, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer, addToCart as addToCartServer } from "@/app/actions/shopping";

export default function WishlistDrawer({ isOpen, onClose }) {
  const { wishlistItems, toggleWishlist, addToCart } = useCart();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState(null);

  const handleRemove = (product) => {
    setProcessingId(product.id);
    startTransition(async () => {
      try {
        await toggleWishlistServer(product.id);
        toggleWishlist(product);
      } catch (error) {
        console.error(error);
      } finally {
        setProcessingId(null);
      }
    });
  };

  const handleMoveToCart = (product) => {
    setProcessingId(product.id);
    startTransition(async () => {
      try {
        const variantId = product.product_variants?.[0]?.id || product.id;
        await addToCartServer(variantId, 1);
        addToCart(product, 1);
        await toggleWishlistServer(product.id);
        toggleWishlist(product);
      } catch (error) {
        console.error(error);
      } finally {
        setProcessingId(null);
      }
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[110] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Wishlist</h2>
            <p className="text-xs text-gray-500 mt-0.5">{wishlistItems.length} items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {wishlistItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <Heart size={48} className="text-gray-200" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your wishlist is empty</h3>
                <p className="text-sm text-gray-500 mt-1">Save your favorite items here.</p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlistItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                  <div className="relative w-20 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.image || item.product_images?.[0]?.image_url || '/images/placeholder.jpg'}
                      alt={item.title || item.name}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2">{item.title || item.name}</h4>
                        <button
                          onClick={() => handleRemove(item)}
                          disabled={isPending && processingId === item.id}
                          className="text-gray-400 hover:text-red-500 disabled:opacity-50 cursor-pointer shrink-0"
                        >
                          {isPending && processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#cfa874] mt-1">
                        ₹{Number(item.price || item.base_price).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleMoveToCart(item)}
                      disabled={(isPending && processingId === item.id) || item.is_active === false}
                      className={`w-full mt-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        item.is_active === false
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800 disabled:opacity-70'
                      }`}
                    >
                      {isPending && processingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                      {item.is_active === false ? 'Out of Stock' : 'Move to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}