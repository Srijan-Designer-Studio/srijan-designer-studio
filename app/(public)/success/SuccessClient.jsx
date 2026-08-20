"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import ScrollToTop from "@/components/providers/ScrollToTop";

export default function SuccessClient() {
  return (
    <main className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6 font-sans pt-[100px]">
      <ScrollToTop />
      
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-lg w-full text-center animate-in zoom-in-95 duration-500 border border-gray-100">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={50} className="text-green-500" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Order Successful!
        </h1>

        <p className="text-gray-600 text-[15px] md:text-base mb-10 leading-relaxed">
          Thank you for shopping with Srijan Fashion. Your order has been placed successfully. We will process it shortly and notify you with the shipping details.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] py-4 rounded-xl transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-[15px] py-4 rounded-xl transition-all border border-gray-200 uppercase tracking-wide"
          >
            View My Orders
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}