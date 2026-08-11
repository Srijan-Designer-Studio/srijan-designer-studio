"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function WeddingHero() {
  const containerRef = useRef(null);
  const bgImageSrc = "/images/banner2.png";

  useGSAP(() => {
    gsap.fromTo(
      ".wed-hero-bg",
      { scale: 1.15 },
      { scale: 1, duration: 1.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".wed-hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]" ref={containerRef}>
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {bgImageSrc && (
          <Image
            src={bgImageSrc}
            alt="Wedding Edit"
            fill
            priority
            className="wed-hero-bg object-cover object-center"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        <div className="max-w-[550px] mt-[90px]">
          <h1 className="wed-hero-text text-5xl sm:text-6xl md:text-[72px] font-bold text-white mb-6 drop-shadow-lg leading-[1.1]">
            The Wedding<br />Wear Edit
          </h1>
          <p className="wed-hero-text text-xl sm:text-2xl text-white font-bold leading-snug drop-shadow-md max-w-[480px]">
            Shop wedding dresses that feels like you or design one from scratch. It's your day, so it's your call
          </p>
        </div>
      </div>
    </section>
  );
}