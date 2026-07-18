"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomizeHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".cust-hero-img",
      { scale: 1.15 },
      { scale: 1, duration: 1.8, ease: "power3.out" }
    );

    gsap.fromTo(
      ".cust-hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative w-full h-screen min-h-[400px]" ref={containerRef}>
      <Image
        src="/images/man1.png"
        alt="Create Your Own Designer Dress"
        fill
        priority
        className="cust-hero-img object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-xl text-white">
            <h1 className="cust-hero-text text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create Your Own<br />Designer Dress
            </h1>
            <p className="cust-hero-text text-lg md:text-xl font-medium">
              Design a one of a kind outfit with our custom dresses service. Made to match your style, your fit and your vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}