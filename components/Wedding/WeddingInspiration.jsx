"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WeddingInspiration() {
  const containerRef = useRef(null);
  const bgImageSrc = "/images/collection1.png";

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".insp-bg-zoom",
      { scale: 1.1 },
      { scale: 1, duration: 1.5, ease: "power3.out" }
    ).fromTo(
      ".insp-text-up",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
      "-=1"
    );
  }, { scope: containerRef });

  return (
    <section className="relative w-full h-[55vh] min-h-[450px] overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 w-full h-full z-0">
        {bgImageSrc && (
          <Image
            src={bgImageSrc}
            alt="Wedding Inspiration"
            fill
            className="insp-bg-zoom object-cover object-center"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="absolute inset-0 flex items-end justify-center pb-16 px-6 z-20">
        <h2 className="insp-text-up text-2xl sm:text-3xl md:text-[34px] font-bold text-white text-center max-w-[900px] leading-[1.3] drop-shadow-lg">
          Inspired by timeless traditions, crafted for moments that become lifelong memories.
        </h2>
      </div>
    </section>
  );
}