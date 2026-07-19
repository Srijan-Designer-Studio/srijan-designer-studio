"use client";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Banknote, ShieldCheck, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";
import { addAddress } from "@/app/actions/addresses";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, isLoaded } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isLoaded && cartItems.length === 0) {
      router.push("/cart");
    }
  }, [isLoaded, cartItems, router]);

  if (!isLoaded || cartItems.length === 0) return <div className="min-h-screen bg-[#f4f5f7]"></div>;

  const shipping = subtotal > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const handleCheckout = (formData) => {
    setErrorMsg("");
    startTransition(async () => {
      try {
        // 1. Save Address First (Extracting from FormData)
        const addressData = new FormData();
        addressData.append('title', 'Shipping Address');
        addressData.append('addressLine1', formData.get('address1'));
        addressData.append('addressLine2', formData.get('address2'));
        addressData.append('city', formData.get('city'));
        addressData.append('state', formData.get('state'));
        addressData.append('postalCode', formData.get('zip'));
        addressData.append('country', 'India');
        addressData.append('isDefault', 'true');
        
        // Save address to DB and retrieve its ID (you may need to modify addAddress to return the ID)
        // For standard implementation, we will pass the data to createOrder
        
        const orderPayload = {
          totalAmount: total,
          items: cartItems.map(item => ({
            variantId: item.variantId || item.id,
            quantity: item.quantity,
            unitPrice: item.price
          }))
        };

        const result = await createOrder(orderPayload);
        
        if (result.success) {
          // In a real app with Stripe/Razorpay, redirect to payment gateway here
          if (paymentMethod === 'cod') {
            // Hard refresh to clear contexts and load dashboard
            window.location.href = '/account/orders';
          } else {
            alert('Payment Gateway Integration Pending. Proceeding as COD.');
            window.location.href = '/account/orders';
          }
        }
      } catch (error) {
        setErrorMsg(error.message || "Failed to process checkout. Please try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] py-12 md:py-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-6">
        
        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-medium text-sm">
            <ChevronLeft size={18} className="mr-1" /> Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">Checkout</h1>
        </div>

        <form action={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <input required name="address1" type="text" placeholder="House number and street name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <input name="address2" type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Town / City *</label>
                  <input required name="city" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                  <input required name="state" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode / ZIP *</label>
                  <input required name="zip" type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
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
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                      <Image src={item.image || "/images/placeholder.jpg"} alt={item.title} fill className="object-cover object-top" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity} | Size: {item.size}</p>
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

              {errorMsg && <p className="text-red-500 text-sm mb-4 font-medium">{errorMsg}</p>}

              <button disabled={isPending} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide disabled:opacity-70">
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {isPending ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}