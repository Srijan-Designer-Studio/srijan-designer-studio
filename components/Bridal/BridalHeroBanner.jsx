"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function BridalHeroBanner() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Cinematic Zoom-out for the background image
    gsap.fromTo(
      ".bridal-hero-img",
      { scale: 1.15 },
      { scale: 1, duration: 1.8, ease: "power3.out" }
    );

    // Staggered text reveal
    gsap.fromTo(
      ".bridal-hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative w-full h-[85vh] sm:h-screen flex items-center overflow-hidden" ref={containerRef}>
      <Image
        src="/images/bidalinquery.png"
        alt="Bridal Banner"
        fill
        priority
        className="bridal-hero-img object-cover object-center -z-10"
      />

      <div className="absolute inset-0 bg-black/15 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 sm:px-12 md:px-24 text-white max-w-xl md:max-w-3xl">
        <h1 className="bridal-hero-text text-4xl sm:text-5xl md:text-6xl font-serif tracking-wide uppercase leading-tight font-light drop-shadow-md">
          Made For Your <br />
          <span className="font-normal">Most Beautiful Day</span>
        </h1>
        
        <p className="bridal-hero-text mt-4 text-xl sm:text-2xl md:text-3xl font-serif italic font-light text-gray-100 drop-shadow-sm">
          Custom bridal wear, <br />
          crafted with love
        </p>
      </div>
    </section>
  );
}