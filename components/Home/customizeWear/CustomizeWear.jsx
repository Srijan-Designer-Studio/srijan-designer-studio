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
  const imageSrc = "/Home_img/7.webp";

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

          <div className="cw-img relative w-full max-w-[524px] aspect-square rounded-[32px] overflow-hidden shadow-lg bg-[#e2e8f0] flex items-center justify-center">
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
            <h2 className="cw-text text-[#ff3838] font-bold uppercase tracking-wider text-xl sm:text-base mb-4 block">
              CUSTOMIZE WEAR
            </h2>
            <h3 className="cw-text text-2xl sm:text-4xl lg:text-[40px] font-bold text-[#111] leading-[1.3] mb-6">
              Got a Design in Your <br className="hidden lg:block" />
              Head? Let's Make It Real
            </h3>
            <p className="cw-text text-gray-600 text-base sm:text-[17px] leading-[1.7] mb-10">
              Sketch it. Screenshot it. Describe it in
              three words. However your idea shows
              up, <strong className="text-black font-bold">SRIJAN Fashion</strong> turn it into a custom
              outfit. Your fabric, your fit and your
              occasion.


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