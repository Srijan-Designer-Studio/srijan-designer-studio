'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toggleWishlist as toggleWishlistServer, addToCart as addToCartServer } from '@/app/actions/shopping';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, toggleWishlist, addToCart, isLoaded } = useCart();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (isLoaded && wishlistItems.length === 0) {
      router.push('/shop-style');
    }
  }, [isLoaded, wishlistItems, router]);

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

  if (!isLoaded || wishlistItems.length === 0) {
    return <div className="min-h-screen bg-white pt-[120px]"></div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-[100px] lg:pt-[120px] space-y-6 font-sans min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">Items you have saved for later ({wishlistItems.length} items).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
              <img
                src={item.image || item.product_images?.[0]?.image_url || '/images/placeholder.jpg'}
                alt={item.title || item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <button
                onClick={() => handleRemove(item)}
                disabled={isPending && processingId === item.id}
                className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm disabled:opacity-50"
              >
                {isPending && processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>

              <div className="absolute bottom-3 left-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${item.is_active !== false ? 'bg-white text-green-600' : 'bg-white text-red-600'
                  }`}>
                  {item.is_active !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col h-[140px] justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {item.title || item.name}
                </h3>
                <p className="text-sm font-bold text-[#cfa874] mt-2">
                  ₹{Number(item.price || item.base_price).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                disabled={(isPending && processingId === item.id) || item.is_active === false}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${item.is_active === false
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-gray-800 shadow-sm disabled:opacity-70'
                  }`}
              >
                {isPending && processingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <ShoppingCart size={14} />}
                {item.is_active === false ? 'Out of Stock' : 'Move to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}