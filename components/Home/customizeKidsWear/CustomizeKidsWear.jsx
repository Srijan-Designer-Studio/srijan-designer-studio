"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CustomizeKidsWear() {
  // Placeholder for the kid's party theme image
  const cardImageSrc = "/images/kids.png";

  // The text string for the marquee
  const marqueeText = "   ✿ BESPOKE FASHION    ✿ TIMELESS ELEGANCE    ✿ DESIGNER COLLECTION    ✿ BRIDAL SPECIALISTS    ✿ CUSTOM-FIT    ";

  return (
    
    <section className="relative bg-gradient-to-br from-[#41425e] via-[#757791] to-[#babbd1] pt-20 lg:pt-28 overflow-hidden flex flex-col justify-between">
      
      {/* Content Container */}
      <div className="max-w-[1320px] mx-auto px-6 w-full mb-20 lg:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Text and Button */}
          <div className="max-w-[500px]">
            {/* Red Subheading */}
            <span className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              CUSTOMIZE KIDS WEAR
            </span>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.3] mb-6">
              Make Every Celebration Extra Special
            </h2>

            {/* Description Paragraph */}
            <p className="text-gray-100 text-base sm:text-[17px] leading-[1.6] mb-8">
              Create adorable custom outfits for birthdays, family events and special 
              occasions, designed to match your theme and your little one's personality.
            </p>

            {/* Cyan Button */}
            <Link
              href="/kids"
              className="
                inline-flex 
                items-center 
                gap-2 
                bg-[#00c3ff] 
                hover:bg-[#00abe0] 
                text-white 
                font-bold 
                text-[15px] 
                px-8 
                py-3.5 
                rounded-full 
                transition-all 
                duration-300 
                shadow-md
                hover:shadow-lg
                hover:-translate-y-0.5
              "
            >
              Design Now
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Right Side: Stacked Cards */}
          <div className="relative w-full max-w-[420px] mx-auto lg:ml-auto aspect-[3/4] lg:aspect-[4/5]">
            
            {/* Back Card (Dark Pink) */}
            <div className="absolute top-6 -right-4 lg:-right-8 w-full h-full bg-[#f472b6] rounded-[24px] shadow-lg"></div>
            
            {/* Middle Card (Light Pink) */}
            <div className="absolute top-3 -right-2 lg:-right-4 w-full h-full bg-[#fbcfe8] rounded-[24px] shadow-lg"></div>

            {/* Front Main Card */}
            <div className="relative w-full h-full bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col">
              
              {/* Top Half: Image */}
              <div className="relative w-full h-[55%] bg-gray-200">
                
                {/* Step Badge */}
                <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-md">
                  Step 1
                </div>

                {cardImageSrc ? (
                  <Image
                    src={cardImageSrc}
                    alt="Occasion & Theme"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#fde68a] flex items-center justify-center">
                    <span className="text-gray-600 font-bold tracking-widest bg-white/50 px-4 py-2 rounded-lg text-sm uppercase">
                      KIDS THEME IMAGE
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Half: Text Area */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-black mb-3">
                  Occasion & Theme
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Tell us about the occasion and your preferred theme. 
                  We'll design an outfit that brings your vision to life.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Bottom Auto-Scrolling Marquee */}
      <div className="w-full bg-[#00c3ff] py-3.5 border-t border-white/20 overflow-hidden relative flex items-center">
        
        {/* Internal CSS for the marquee animation */}
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: inline-flex;
              white-space: nowrap;
              animation: marquee 25s linear infinite;
            }
          `}
        </style>

        {/* Marquee Wrapper */}
        <div className="animate-marquee">
          {/* We render the text string 4 times to ensure a seamless infinite loop */}
          <span className="text-white font-bold tracking-widest text-sm sm:text-base">
            {marqueeText}
          </span>
          <span className="text-white font-bold tracking-widest text-sm sm:text-base">
            {marqueeText}
          </span>
          <span className="text-white font-bold tracking-widest text-sm sm:text-base">
            {marqueeText}
          </span>
          <span className="text-white font-bold tracking-widest text-sm sm:text-base">
            {marqueeText}
          </span>
        </div>
      </div>

    </section>
  );
}