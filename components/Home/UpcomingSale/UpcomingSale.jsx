"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function UpcomingSale() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".sale-title",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".sale-desc",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="bg-[#FDF4F3] py-2" ref={containerRef}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="overflow-hidden">
          <h2 className="sale-title text-[40px] font-light uppercase tracking-tight text-[#111]">
            UPCOMING SALE
          </h2>
        </div>
        <p className="sale-desc mt-2 text-[16px] text-[#444]">
          Existing Offers Coming Soon! Stay Tuned.
        </p>
      </div>
    </section>
  );
}