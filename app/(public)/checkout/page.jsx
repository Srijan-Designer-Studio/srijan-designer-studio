"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, ChevronLeft, Loader2, Smartphone, Wallet, Building2, Ban, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/app/actions/orders";
import { initiatePaytmTransaction } from "@/app/actions/paytm";
import { createClient } from "@/lib/supabase/client";
import ScrollToTop from "@/components/providers/ScrollToTop";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotal, isLoaded, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
      } else {
        setUserProfile(user);
        setIsAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (isLoaded && cartItems.length === 0 && !isAuthChecking) {
      router.push("/cart");
    }
  }, [isLoaded, cartItems, router, isAuthChecking]);

  if (isAuthChecking || !isLoaded || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[#00c3ff]" />
      </div>
    );
  }

  const shipping = subtotal > 0 ? 150 : 0;
  const frontendTotal = subtotal + shipping;

  const handleCheckout = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setErrorMsg("");

    startTransition(async () => {
      try {
        const orderPayload = {
          totalAmount: frontendTotal,
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

        const dbResult = await createOrder({ 
          ...orderPayload, 
          paymentStatus: 'Pending',
          status: 'pending' 
        });

        if (!dbResult.success) {
          throw new Error(dbResult.error || "Failed to create order");
        }

        const orderId = dbResult.data.id;
        const customerId = userProfile?.id || `CUST_${Date.now()}`;

        const paytmResult = await initiatePaytmTransaction(orderId, frontendTotal, customerId);

        if (!paytmResult.success) {
          throw new Error(paytmResult.error || "Paytm initialization failed");
        }

        const txnToken = paytmResult.data.txnToken;
        const mid = process.env.NEXT_PUBLIC_PAYTM_MID;
        const isProduction = process.env.NODE_ENV === 'production';
        const hostname = isProduction ? 'securegw.paytm.in' : 'securegw-stage.paytm.in';

        clearCart();

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `https://${hostname}/theia/api/v1/showPaymentPage?mid=${mid}&orderId=${orderId}`;

        const midInput = document.createElement('input');
        midInput.type = 'hidden';
        midInput.name = 'mid';
        midInput.value = mid;
        form.appendChild(midInput);

        const orderIdInput = document.createElement('input');
        orderIdInput.type = 'hidden';
        orderIdInput.name = 'orderId';
        orderIdInput.value = orderId;
        form.appendChild(orderIdInput);

        const txnTokenInput = document.createElement('input');
        txnTokenInput.type = 'hidden';
        txnTokenInput.name = 'txnToken';
        txnTokenInput.value = txnToken;
        form.appendChild(txnTokenInput);

        document.body.appendChild(form);
        form.submit();

      } catch (error) {
        setErrorMsg(error.message || "Failed to process checkout. Please try again.");
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f5f7] py-12 md:py-20 font-sans pt-[100px] lg:pt-[120px]">
      <ScrollToTop />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
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
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-green-600" size={24} />
                Secure Payment
              </h2>

              <div className="space-y-4">
                <label className="flex flex-col p-5 border rounded-xl cursor-default transition-all border-[#00c3ff] bg-[#00c3ff]/5">
                  <div className="flex items-center mb-4">
                    <input type="radio" name="payment" value="online" checked readOnly className="w-4 h-4 text-[#00c3ff] focus:ring-[#00c3ff] border-gray-300" />
                    <CreditCard className="ml-4 mr-3 text-[#00c3ff]" size={24} />
                    <span className="font-bold text-gray-900 text-lg">Pay with Paytm</span>
                  </div>

                  <div className="ml-11 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2 py-1.5 rounded-lg shadow-sm">
                      <Smartphone size={14} className="text-[#00baf2]" /> Paytm
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2 py-1.5 rounded-lg shadow-sm">
                      <Smartphone size={14} className="text-[#6528e0]" /> UPI
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2 py-1.5 rounded-lg shadow-sm">
                      <CreditCard size={14} className="text-gray-900" /> Cards
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2 py-1.5 rounded-lg shadow-sm">
                      <Building2 size={14} className="text-orange-500" /> Net Banking
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-2 py-1.5 rounded-lg shadow-sm">
                      <Wallet size={14} className="text-pink-500" /> Wallet
                    </div>
                  </div>
                </label>

                <div className="flex items-center gap-2 text-[13px] font-bold text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                  <Ban size={16} strokeWidth={2.5} />
                  No Cash on Delivery (COD) Available
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

              <div className="space-y-5 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
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
                  ₹{frontendTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {errorMsg && <p className="text-red-500 text-sm mb-4 font-medium">{errorMsg}</p>}

              <button disabled={isPending} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide disabled:opacity-70 cursor-pointer">
                {isPending && <Loader2 size={18} className="animate-spin" />}
                {isPending ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}