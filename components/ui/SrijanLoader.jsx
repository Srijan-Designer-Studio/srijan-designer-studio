'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SrijanLoader() {
  const [mounted, setMounted] = useState(false);

 
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAFAFA] transition-all duration-700">
      <div className="flex flex-col items-center premium-entrance">
        
       
        <div className="relative w-[120px] sm:w-[150px] md:w-[180px] h-auto aspect-[3/1] mb-8">
          <Image
            src="/images/logo5.webp" 
            alt="Srijan Fashion"
            fill
            priority
            className="object-contain"
            unoptimized
          />
        </div>

        {/* Loading Section */}
        <div className="flex flex-col items-center gap-4">
          {/* Ultra Thin Loading Line */}
          <div className="w-32 sm:w-40 h-[1px] bg-gray-200 overflow-hidden relative rounded-full">
            <div className="absolute top-0 left-0 h-full w-full bg-black animate-premium-line"></div>
          </div>

          {/* Minimal Text with wide letter-spacing */}
          <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-gray-400 uppercase font-medium animate-pulse-slow">
            Loading
          </span>
        </div>
      </div>

      {/* Luxury Custom CSS Animations */}
      <style jsx global>{`
        /* Logo Entrance Animation */
        .premium-entrance {
          animation: elegantFade 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes elegantFade {
          0% {
            opacity: 0;
            transform: translateY(15px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Smooth Sweeping Line Animation */
        @keyframes premiumLine {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-premium-line {
          animation: premiumLine 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }

        /* Very subtle text pulse */
        .animate-pulse-slow {
          animation: subtlePulse 2.5s ease-in-out infinite;
        }

        @keyframes subtlePulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}