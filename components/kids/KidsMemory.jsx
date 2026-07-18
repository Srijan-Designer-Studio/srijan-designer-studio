"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function KidsMemory() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".memory-img",
      { x: -50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      ".memory-text",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2 relative flex justify-center">
          <div className="memory-img relative w-full max-w-[500px] aspect-square">
            <Image
              src="/images/kids.png"
              alt="Memory Camera"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="memory-text text-3xl md:text-4xl lg:text-[42px] font-bold text-black mb-6 font-serif leading-tight">
            Make Every Click a<br />Memory to Keep
          </h2>
          <p className="memory-text text-gray-700 text-[15px] md:text-base leading-relaxed">
            Some moments happen only once and every click should bring back a happy memory. At <strong>SRIJAN Fashion</strong>, we help you customize kids wear that feels personal and looks beautiful. Whether it's a birthday, festival, family function or photoshoot, we create outfits that fit your child perfectly and make every picture even more special.
          </p>
        </div>
      </div>
    </section>
  );
}