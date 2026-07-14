"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutIntro() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".about-heading",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    )
    .fromTo(
      ".about-desc",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(
      ".about-btn",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="bg-white py-24" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-5">
        
        <div className="overflow-hidden pb-2">
          <h2 className="about-heading text-center text-[56px] leading-none font-semibold italic text-[#111111]">
            Designed by Us, Styled for You
          </h2>
        </div>

        <p className="about-desc max-w-[1050px] mx-auto mt-10 text-center text-[28px] leading-[46px] text-[#111111] font-normal">
          <span className="font-bold uppercase">
            "SRIJAN"
          </span>{" "}
          is an Indian luxury fashion brand creating bridal,
          ethnic, western and custom designer wear for women,
          men and kids. We design moments, not just outfits.
        </p>

        <div className="flex justify-center mt-12">
          <div className="about-btn">
            <Link
              href="/about"
              className="inline-flex items-center gap-3 text-[18px] font-semibold uppercase tracking-[1px] hover:gap-5 transition-all duration-300"
            >
              ABOUT US
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}