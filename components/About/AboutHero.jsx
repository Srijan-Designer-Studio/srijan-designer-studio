"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function AboutHero() {
  const containerRef = useRef(null);
  const bgImageSrc = "/images/about.png"; 

  useGSAP(() => {
    gsap.fromTo(
      ".hero-anim",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative w-full h-screen min-h-[600px] -mt-[90px]" ref={containerRef}>
      
      <div className="absolute inset-0 w-full h-full z-0">
        {bgImageSrc ? (
          <Image
            src={bgImageSrc}
            alt="About Srijan Fashion"
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 flex items-center justify-center">
             <span className="text-white/50 font-bold tracking-widest px-4 py-2 text-sm uppercase">
                HERO BACKGROUND IMAGE
             </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        <div className="max-w-[700px] mt-[90px]">
          <h1 className="hero-anim text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Where Every Design Begins with Your Vision
          </h1>
          <p className="hero-anim text-lg sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
            At Srijan Fashion, we create designer outfits and custom designs that 
            celebrate your unique style and personality.
          </p>
        </div>
      </div>
      
    </section>
  );
}