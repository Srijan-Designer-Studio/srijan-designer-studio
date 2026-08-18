"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function KidsHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".kids-hero-img",
      { scale: 1.15 },
      { scale: 1, duration: 1.8, ease: "power3.out" }
    );

    gsap.fromTo(
      ".kids-hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]" ref={containerRef}>
      <Image
        src="/images/kids.png"
        alt="Customize Kids Wear"
        fill
        priority
        className="kids-hero-img object-cover object-right md:object-center"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-lg text-white mt-[90px]">
            <h1 className="kids-hero-text text-4xl md:text-5xl lg:text-[56px] font-bold mb-4 leading-tight drop-shadow-md">
              Customize Kids<br />Wear
            </h1>
            <p className="kids-hero-text text-lg md:text-xl font-medium drop-shadow-md">
              Capture every little moment, dressed just right.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}