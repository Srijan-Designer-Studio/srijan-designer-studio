"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      ".about-img-main",
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out" }
    )
      .fromTo(
        ".about-img-main img",
        { scale: 1.2 },
        { scale: 1, duration: 1.2, ease: "power4.out" },
        "<"
      )
      .fromTo(
        ".about-img-overlay",
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ".about-img-overlay img",
        { scale: 1.2 },
        { scale: 1, duration: 1, ease: "power3.out" },
        "<"
      )
      .fromTo(
        ".about-text-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.8"
      )
      .fromTo(
        ".about-text-head",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
        "-=0.5"
      )
      .fromTo(
        ".about-text-desc",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

   
    gsap.to(".about-img-overlay", {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 lg:py-32 bg-gradient-to-r from-white to-[#eef2f6] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">

          <div className="relative w-full flex justify-center lg:justify-end lg:pr-16">
           
           <div className="about-img-main relative w-[320px] sm:w-[400px] h-[450px] sm:h-[550px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="/images/man3.png"
                alt="Main About Image"
                fill
               
                className="object-cover object-top"
              />
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:left-4 lg:-left-4 z-10 about-img-overlay">
              
              <div className="w-[240px] sm:w-[300px] h-[260px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl border-[6px] border-white flex items-center justify-center relative bg-white">
                <Image
                  src="/images/banner2.png"
                  alt="Overlay About Image"
                  fill  
                  className="object-cover object-center" 
                />
              </div>
            </div>
          </div>

          <div className="max-w-[550px] mt-10 lg:mt-0">
            <span className="about-text-sub text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              ABOUT US
            </span>

            <div className="overflow-hidden pb-2">
              <h2 className="about-text-head text-4xl sm:text-5xl lg:text-[46px] font-bold text-[#111] leading-[1.2] mb-6">
                Fashion Made for Every Style
              </h2>
            </div>

            <p className="about-text-desc text-lg sm:text-[19px] text-[#444] leading-relaxed">
              At <strong className="text-black font-bold">SRIJAN Fashion</strong>, we believe every
              outfit should reflect your personality. From everyday wear to special
              occasions, our online shopping experience makes it easy to discover
              beautiful designs. Explore the latest fashion styles or create a custom
              outfit made just for you.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}