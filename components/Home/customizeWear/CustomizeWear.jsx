"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CustomizeWear() {
  const containerRef = useRef(null);
  const imageSrc = "/images/desiner.png";

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".cw-img",
      { scale: 0.85, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" }
    ).fromTo(
      ".cw-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.8"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="cw-img relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/4.2] rounded-[32px] overflow-hidden shadow-lg bg-[#e2e8f0] flex items-center justify-center">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt="Create Your Own Custom Dress"
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-gray-500 font-bold tracking-widest bg-white/60 px-6 py-3 rounded-xl uppercase text-sm">
                Customize Image Placeholder
              </span>
            )}
          </div>

          <div className="flex flex-col items-start max-w-[550px]">
            <span className="cw-text text-[#ff3838] font-bold uppercase tracking-wider text-sm mb-4 block">
              CUSTOMIZE WEAR
            </span>
            <h2 className="cw-text text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111] leading-[1.3] mb-6">
              Create Your Own <br className="hidden lg:block" />
              Custom Dress
            </h2>
            <p className="cw-text text-gray-600 text-base sm:text-[17px] leading-[1.7] mb-10">
              Have a design in mind? We'll turn your ideas into a custom outfit made to fit
              your style, your size and your occasion. From fabric to the final stitch, every
              detail is made just for you.
            </p>
            <div className="cw-text">
              <Link
                href="/create-designer-dress"
                className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Customize Now
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}