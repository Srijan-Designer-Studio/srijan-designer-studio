"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <>
  
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-black uppercase tracking-wide flex items-center gap-2">
            Your Cart <span className="bg-black text-white text-xs px-2 py-1 rounded-full">{cartItems.length}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingBag size={48} className="text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-900">Your cart is empty</p>
              <p className="text-[15px] text-gray-500 mb-4">Looks like you haven't added anything yet.</p>
              <Link href="/product" className="bg-black hover:bg-gray-800 text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wide text-sm transition-colors shadow-lg">
              Continue Shopping
            </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.variantId || item.id} className="flex gap-4 group">
                  {/* Image */}
                  <div className="relative w-[85px] h-[110px] rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                    <img
                      src={item.image || "/images/placeholder.jpg"}
                      alt={item.title}
                      className="object-cover object-top"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col flex-1 justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link href={`/product/${item.id}`} onClick={onClose}>
                          <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 hover:text-[#00c3ff] transition-colors leading-tight">
                            {item.title}
                          </h3>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.variantId || item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {(item.size || item.color) && (
                        <p className="text-[13px] font-medium text-gray-500 mt-1.5">
                          {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[16px] font-extrabold text-black">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                      
                      {/* Plus/Minus Buttons */}
                      <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-[34px]">
                        <button
                          onClick={() => updateQuantity(item.variantId || item.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="w-8 text-center text-[14px] font-bold text-black">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId || item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black transition-colors"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Area */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-4px_15px_rgba(0,0,0,0.02)] z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[15px] text-gray-500 font-medium uppercase tracking-wide">Subtotal</span>
              <span className="text-2xl font-extrabold text-black">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[13px] text-gray-400 mb-5">
              Shipping & taxes calculated at checkout.
            </p>
            <Link href="/checkout" onClick={onClose} className="block w-full">
              <button className="w-full bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] uppercase tracking-wider py-4 rounded-xl transition-colors shadow-lg shadow-[#00c3ff]/30">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}