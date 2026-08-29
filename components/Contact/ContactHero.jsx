"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ContactHero() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".contact-hero-img",
      { scale: 1.15 },
      { scale: 1, duration: 1.5, ease: "power3.out" }
    );

    gsap.fromTo(
      ".contact-hero-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.2 }
    );
  }, { scope: containerRef });

  return (
    
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]" ref={containerRef}>
      <Image
        src="/others-img/Contact Us HERO Section.webp"
        alt="Connect with Srijan Fashion"
        fill
        className="contact-hero-img object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1320px] w-full mx-auto px-6">
         
          <div className="text-white drop-shadow-md mt-[90px]">
            <p className="contact-hero-text text-xl md:text-3xl font-bold mb-2">Let's</p>
            <h1 className="contact-hero-text text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.15] md:leading-[1.1] mb-4 md:mb-6 drop-shadow-md">
              Connect<br />with SRIJAN Fashion
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}