"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function WomenHero() {
  const containerRef = useRef(null);
  const bgImageSrc = "/others-img/For Women HERO Section.webp";

  useGSAP(() => {
    gsap.fromTo(
      ".women-hero-bg",
      { scale: 1.15 },
      { scale: 1, duration: 1.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".women-hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]" ref={containerRef}>

      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <Image
          src={bgImageSrc}
          alt="Shop Stylish Outfits for Women"
          fill
          priority
          className="women-hero-bg object-cover object-center"
        />
      </div>

      {/* <div className="absolute inset-0 bg-black/30 z-10"></div> */}

      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        <div className="max-w-[700px] mt-[90px]">

          <h1 className="women-hero-text text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Shop Stylish Outfits <br className="hidden sm:block" />
            for Women
          </h1>

          <p className="women-hero-text text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
            Discover elegant designer outfits
            and trendy women wear crafted
            to match your style, comfort and
            every occasion.
          </p>

        </div>
      </div>

    </section>
  );
}