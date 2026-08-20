"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartClient() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, isLoaded } = useCart();

  if (!isLoaded) return <div className="min-h-screen bg-[#f8f9fa]"></div>;

  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  return (
    <main className="py-16 md:py-24 bg-[#f8f9fa] min-h-screen pt-[100px] lg:pt-[120px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-2xl md:text-4xl font-extrabold text-black uppercase tracking-wider mb-10 text-center">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white p-16 rounded-3xl shadow-sm border border-gray-100 text-center">
            <ShoppingBag size={80} className="text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link href="/" className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md uppercase tracking-wide">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 gap-6 transition-all hover:shadow-md">
                  <Link href={`/product/${item.slug || item.id}`} className="relative w-28 h-36 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={item.image || "/images/placeholder.jpg"} alt={item.title || "Product"} className="object-cover object-top h-full w-full" />
                  </Link>

                  <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full">
                    <Link href={`/product/${item.slug || item.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-[#00c3ff] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </Link>

                    {(item.size || item.color) && (
                      <p className="text-[19px] text-gray-500 mb-2">
                        {item.color && `Color: ${item.color}`}
                        {item.size && item.color && ' | '}
                        {item.size && `Size: ${item.size}`}
                      </p>
                    )}

                    <p className="text-xl font-extrabold text-black mb-4">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center gap-6 w-full justify-center sm:justify-start">
                      <div className="flex items-center justify-between border border-gray-300 rounded-lg w-[120px] h-[40px] px-3 bg-gray-50">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-600 hover:text-black"><Minus size={18} /></button>
                        <span className="text-[16px] font-medium text-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-600 hover:text-black"><Plus size={18} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider">
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-24">
              <h3 className="text-xl font-bold text-black mb-6 uppercase tracking-wide border-b border-gray-200 pb-4">Order Summary</h3>
              <div className="space-y-4 text-[15px] text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span className="font-medium text-gray-900">₹{shipping.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-6 mb-8">
                <span className="text-lg font-bold text-black uppercase tracking-wider">Total</span>
                <span className="text-3xl font-extrabold text-black">₹{total.toLocaleString('en-IN')}</span>
              </div>
              <Link href="/checkout" className="block w-full">
                <button className="w-full bg-black hover:bg-gray-800 text-white font-bold text-[15px] uppercase tracking-wide py-4 rounded-xl transition-colors shadow-lg">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}