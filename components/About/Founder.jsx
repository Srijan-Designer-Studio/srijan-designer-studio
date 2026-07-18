"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const containerRef = useRef(null);
  const imageSrc = "/images/neha.png";

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".founder-img",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" }
    ).fromTo(
      ".founder-text",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.8"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-[#1c1d42] via-[#383a5e] to-[#808197]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          <div className="lg:col-span-5 flex justify-center lg:justify-start w-full">
            <div className="founder-img relative w-full max-w-[500px] aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Mithu Roy — Founder, SRIJAN Fashion"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#94a3b8] flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-white/80 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-sm uppercase">
                    FOUNDER IMAGE
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 max-w-[650px]">
            <span className="founder-text text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              A WORD FROM THE FOUNDER
            </span>
            <h2 className="founder-text text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-[1.3] mb-6">
              Mithu Roy — Founder, <br className="hidden sm:block" />
              SRIJAN Fashion
            </h2>
            <p className="founder-text text-[16px] lg:text-[18px] text-gray-100 leading-[1.7]">
              At SRIJAN Fashion, we believe every outfit should reflect your personality.
              Our goal is to create designs that make you feel confident, comfortable,
              and special on every occasion. Thank you for being a part of our journey.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}