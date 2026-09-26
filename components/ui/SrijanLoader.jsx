'use client';

import Image from 'next/image';

export default function SrijanLoader() {
  const SrijanLogo = "/Loading-Ani/SRIJAN Logo.svg";

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#0a103c] to-[#7f839d] transition-all duration-700">
      <div className="flex flex-col items-center premium-entrance">
        
        <div className="relative w-[180px] sm:w-[220px] md:w-[260px] h-auto aspect-[16/9] mb-8">
          <Image 
            src={SrijanLogo} 
            alt="Srijan Logo" 
            fill 
            priority
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Animated Glowing Line Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 sm:w-48 h-[2px] bg-white/10 overflow-hidden relative rounded-full">
            <div className="absolute top-0 left-0 h-full w-[50%] bg-gradient-to-r from-transparent via-white to-transparent sweep-animation shadow-[0_0_12px_rgba(255,255,255,0.9)]"></div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .premium-entrance {
          animation: elegantFade 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .sweep-animation {
          animation: sweepingLine 1.5s infinite ease-in-out;
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

        @keyframes sweepingLine {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}