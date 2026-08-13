"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CheckCircle2, XCircle, X } from "lucide-react";

function NotificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const s = searchParams.get("status");
    if (s === "success" || s === "failed" || s === "error" || s === "checksum_failed") {
      setStatus(s);
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
        router.replace(pathname, { scroll: false });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, pathname, router]);

  if (!isVisible || !status) return null;

  const isSuccess = status === "success";

  return (
    <div className="fixed top-24 right-5 md:right-10 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border max-w-sm ${
        isSuccess ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
      }`}>
        {isSuccess ? (
          <CheckCircle2 className="text-green-600 shrink-0 mt-0.5" size={24} />
        ) : (
          <XCircle className="text-red-600 shrink-0 mt-0.5" size={24} />
        )}
        
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${isSuccess ? "text-green-900" : "text-red-900"}`}>
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h3>
          <p className={`text-xs mt-1 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
            {isSuccess 
              ? "Your order has been placed successfully. Thank you!" 
              : status === "checksum_failed" 
                ? "Payment verification failed. Please contact support." 
                : "Something went wrong with your transaction. Please try again."}
          </p>
        </div>

        <button 
          onClick={() => {
            setIsVisible(false);
            router.replace(pathname, { scroll: false });
          }} 
          className={`p-1 rounded-md transition-colors ${isSuccess ? "hover:bg-green-200 text-green-700" : "hover:bg-red-200 text-red-700"}`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default function PaymentNotification() {
  return (
    <Suspense fallback={null}>
      <NotificationContent />
    </Suspense>
  );
}