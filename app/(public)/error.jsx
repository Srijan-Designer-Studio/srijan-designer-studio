"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 font-sans">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-500 mb-8 text-sm md:text-base">
          We apologize for the inconvenience. An unexpected error has occurred in our system. Our team has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-bold text-[14px] rounded-full hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold text-[14px] rounded-full hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm cursor-pointer"
          >
            <Home size={16} />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}