"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function BlogHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Background Image Zoom-out Effect
    gsap.fromTo(
      ".hero-img",
      { scale: 1.15 },
      { scale: 1, duration: 1.5, ease: "power3.out" }
    );

    // Text Fade-up Effect
    gsap.fromTo(
      ".hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]" ref={containerRef}>
      <Image
        src="/images/banner.png"
        alt="Our Blogs"
        fill
        className="hero-img object-cover object-top object-center"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-xl text-white mt-10">
            <h1 className="hero-text text-4xl md:text-5xl lg:text-[56px] font-bold mb-4 leading-tight font-serif">
              Our Blogs
            </h1>
            <p className="hero-text text-lg md:text-xl font-medium leading-relaxed">
              Stay updated with the latest fashion styles, styling guides and trend insights to help you look your best every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}