"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Banknote, ShieldCheck, ChevronLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, isLoaded } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (isLoaded && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isLoaded, cartItems, router]);

  if (!isLoaded || cartItems.length === 0) return <div className="min-h-screen bg-[#f4f5f7]"></div>;

  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-[#f4f5f7] py-12 md:py-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-medium text-sm">
            <ChevronLeft size={18} className="mr-1" /> Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <input type="text" placeholder="House number and street name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Town / City *</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State / County *</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode / ZIP *</label>
                  <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#00c3ff] bg-[#00c3ff]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-[#00c3ff] focus:ring-[#00c3ff] border-gray-300" />
                  <CreditCard className={`ml-4 mr-3 ${paymentMethod === 'card' ? 'text-[#00c3ff]' : 'text-gray-400'}`} size={24} />
                  <span className={`font-medium ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-700'}`}>Credit / Debit Card</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#00c3ff] bg-[#00c3ff]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="w-4 h-4 text-[#00c3ff] focus:ring-[#00c3ff] border-gray-300" />
                  <Wallet className={`ml-4 mr-3 ${paymentMethod === 'upi' ? 'text-[#00c3ff]' : 'text-gray-400'}`} size={24} />
                  <span className={`font-medium ${paymentMethod === 'upi' ? 'text-gray-900' : 'text-gray-700'}`}>UPI / Wallet</span>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#00c3ff] bg-[#00c3ff]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#00c3ff] focus:ring-[#00c3ff] border-gray-300" />
                  <Banknote className={`ml-4 mr-3 ${paymentMethod === 'cod' ? 'text-[#00c3ff]' : 'text-gray-400'}`} size={24} />
                  <span className={`font-medium ${paymentMethod === 'cod' ? 'text-gray-900' : 'text-gray-700'}`}>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
              
              <div className="space-y-5 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image src={item.image} alt={item.title || "Product"} fill className="object-cover object-top" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-extrabold text-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-5 mb-5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">₹{shipping.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-200 pt-5 mb-8">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-[#0ba6ff]">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-start gap-3 mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                <ShieldCheck size={20} className="text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-800 leading-relaxed">Safe and secure payments. 100% Authentic products.</p>
              </div>

              <button className="w-full bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide">
                Place Order
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}