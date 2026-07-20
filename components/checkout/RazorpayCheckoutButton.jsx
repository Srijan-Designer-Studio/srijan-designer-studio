'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/payment';

// Utility to inject the Razorpay script into the DOM securely
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function RazorpayCheckoutButton({ amount, dbOrderId, customerName, customerEmail, customerPhone }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePayment = async () => {
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // 1. Load the script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Check your connection.");
      }

      // 2. Call backend to create Razorpay Order
      const res = await createRazorpayOrder(amount, dbOrderId);
      if (!res.success) {
        throw new Error("Could not initialize payment.");
      }

      // 3. Configure Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Safe to expose
        amount: res.order.amount,
        currency: res.order.currency,
        name: "SRIJAN Fashion",
        description: `Order #${dbOrderId}`,
        image: "/images/logo.png", // Add your logo path here
        order_id: res.order.id, // The Razorpay Order ID from backend
        handler: function (response) {
          // 4. Handle Success: Send details to backend for verification
          startTransition(async () => {
            try {
              const verifyRes = await verifyRazorpayPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
                dbOrderId
              );
              
              if (verifyRes.success) {
                // Payment verified, redirect to success page
                router.push(`/checkout/success?order_id=${dbOrderId}`);
              }
            } catch (err) {
              setErrorMsg(err.message);
            }
          });
        },
        prefill: {
          name: customerName || "",
          email: customerEmail || "",
          contact: customerPhone || "",
        },
        theme: {
          color: "#000000", // Matches your black/white premium theme
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      // 5. Open the Razorpay Checkout Modal
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        setErrorMsg(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      paymentObject.open();

    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100">
          {errorMsg}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={isProcessing || isPending}
        className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-wider shadow-md hover:bg-gray-800 disabled:opacity-70 transition-colors flex items-center justify-center gap-2"
      >
        {(isProcessing || isPending) && <Loader2 size={18} className="animate-spin" />}
        {isProcessing || isPending ? "Processing Securely..." : `Pay ₹${Number(amount).toLocaleString('en-IN')}`}
      </button>
    </div>
  );
}