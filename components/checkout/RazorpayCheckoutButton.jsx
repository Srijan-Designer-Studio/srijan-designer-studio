'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/app/actions/payments';

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
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Failed to load Razorpay SDK. Check your connection.");
      }

      const res = await createRazorpayOrder(amount, dbOrderId);
      if (!res.success) {
        throw new Error("Could not initialize payment.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.order.amount,
        currency: res.order.currency,
        name: "SRIJAN Fashion",
        description: `Order #${dbOrderId}`,
        image: "/email-img/logo.webp",
        order_id: res.order.id,
        handler: function (response) {
          startTransition(async () => {
            try {
              const verifyRes = await verifyRazorpayPayment(
                response.razorpay_payment_id,
                response.razorpay_order_id,
                response.razorpay_signature,
                dbOrderId
              );
              
              if (verifyRes.success) {
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
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

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