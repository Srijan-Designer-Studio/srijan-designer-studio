"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSrijan() {
  const containerRef = useRef(null);
  const imageSrc = "/images/aboutmodel.png";

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".about-srijan-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(
      ".about-srijan-img",
      { x: 50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 lg:py-32 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="max-w-[600px]">
            <h2 className="about-srijan-text text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-8">
              “SRIJAN” means Creation.
            </h2>
            <p className="about-srijan-text text-[17px] leading-[1.7] text-gray-800 mb-6">
              And that is exactly what we do. We don’t just sell clothes; we create
              statements, memories and moments.
            </p>
            <p className="about-srijan-text text-[17px] leading-[1.7] text-gray-800 mb-6">
              At <strong className="font-bold text-black">SRIJAN Fashion</strong>, we believe
              that fashion shouldn’t be limited by what’s on a rack. Whether it’s a
              screenshot from Instagram, a sketch on a napkin or a dream you’ve had
              since you were five we exist to bring it to life.
            </p>
            <p className="about-srijan-text text-[17px] leading-[1.7] text-gray-800">
              We are a new-age fashion house in Kolkata that bridges the gap between
              exclusive designer luxury and accessible, custom fashion.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end w-full">
            <div className="about-srijan-img relative w-full max-w-[420px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Srijan Fashion Creation"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#a4a5b9] to-[#45455e] flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-white/70 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-sm uppercase">
                    ABOUT IMAGE
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}