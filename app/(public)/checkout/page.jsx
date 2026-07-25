"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Banknote, ChevronLeft, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/app/actions/payments";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, isLoaded, clearCart } = useCart();
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

  const handleCheckout = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setErrorMsg("");

    startTransition(async () => {
      try {
        const orderPayload = {
          totalAmount: total,
          paymentMethod: paymentMethod,
          address: {
            addressLine1: formData.get('address1'),
            addressLine2: formData.get('address2'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip: formData.get('zip'),
          },
          items: cartItems.map(item => ({
            variantId: item.variantId || item.id,
            quantity: item.quantity,
            unitPrice: item.price
          }))
        };

        const dbResult = await createOrder({ ...orderPayload, paymentStatus: 'Pending', status: 'pending' });

        if (!dbResult.success) {
          throw new Error(dbResult.error || "Failed to create order");
        }

        const dbOrderId = dbResult.data?.id || dbResult.order?.id || dbResult.id;

        if (paymentMethod === 'cod') {
          clearCart();
          window.location.href = '/account/orders';
          return;
        }

        if (paymentMethod === 'card') {
          const isScriptLoaded = await loadRazorpayScript();
          if (!isScriptLoaded) throw new Error("Razorpay SDK failed to load. Are you online?");

          const rpResult = await createRazorpayOrder(total, dbOrderId);

          if (!rpResult.success) throw new Error(rpResult.error || "Failed to initialize Razorpay");

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: rpResult.order.amount,
            currency: rpResult.order.currency,
            name: "SRIJAN Fashion",
            description: "Secure Payment for your order",
            order_id: rpResult.order.id,
            handler: async function (response) {
              try {
                const verifyResult = await verifyRazorpayPayment(
                  response.razorpay_payment_id,
                  response.razorpay_order_id,
                  response.razorpay_signature,
                  dbOrderId
                );

                if (verifyResult.success) {
                  clearCart();
                  window.location.href = '/account/orders';
                } else {
                  throw new Error("Verification failed");
                }
              } catch (err) {
                clearCart();
                alert("Payment successful but verification failed. Contact support.");
                window.location.href = '/account/orders';
              }
            },
            prefill: {
              name: "Customer",
              email: "customer@example.com",
            },
            theme: {
              color: "#00c3ff",
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.on('payment.failed', function (response) {
            alert("Payment Failed: " + response.error.description);
          });
          paymentObject.open();
        }
      } catch (error) {
        setErrorMsg(error.message || "Failed to process checkout. Please try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] py-12 md:py-20 font-sans">
      <div className="max-w-[1200px] mx-auto px-10">

        <div className="mb-8">
          <Link href="/cart" className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-medium text-sm">
            <ChevronLeft size={18} className="mr-1" /> Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <input required name="address1" type="text" placeholder="House number and street name" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div className="md:col-span-2">
                  <input name="address2" type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Town / City *</label>
                  <input required name="city" type="text" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                  <input required name="state" type="text" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Postcode / ZIP *</label>
                  <input required name="zip" type="text" className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00c3ff]/50 focus:border-[#00c3ff] transition-all" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#00c3ff] bg-[#00c3ff]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-[#00c3ff] focus:ring-[#00c3ff] border-gray-300" />
                  <CreditCard className={`ml-4 mr-3 ${paymentMethod === 'card' ? 'text-[#00c3ff]' : 'text-gray-400'}`} size={24} />
                  <span className={`font-medium ${paymentMethod === 'card' ? 'text-gray-900' : 'text-gray-700'}`}>Pay Online (Card / UPI)</span>
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
                      <img
                        src={item.image || "/images/placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover object-top"
                      />
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
                {isPending ? "Processing..." : paymentMethod === 'cod' ? "Place Order" : "Pay Now"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}