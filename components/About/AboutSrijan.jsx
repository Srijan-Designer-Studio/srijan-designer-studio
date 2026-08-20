"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutSrijan() {
  const containerRef = useRef(null);
  const imageSrc = "/About-img/11.webp";

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
    <section className="py-16 lg:py-32 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          <div className="max-w-[640px] order-1">
            <h2 className="about-srijan-text text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-8">
              SRIJAN" Means Creation. It's Not
              Just Our Name, It's Our Craft
            </h2>
            <p className="about-srijan-text text-[16px] lg:text-[19px] leading-[1.7] text-gray-800 mb-6">
              We don't sell clothes. We sell the version of you that
              you haven't worn yet.
            </p>
            <p className="about-srijan-text text-[16px] lg:text-[19px] leading-[1.7] text-gray-800 mb-6">
              That screenshot you saved at 1 a.m. The napkin sketch
              you never showed anyone. The outfit you've been
              imagining since you were five and playing dress-up in
              your mother's dupatta. We don't just copy it. We build
              it, thread by thread, until it's real.
            </p>
            <p className="about-srijan-text text-[16px] lg:text-[19px] leading-[1.7] text-gray-800">
              SRIJAN is Kolkata's answer to a simple question: why
              should designer luxury feel out of reach?
            </p>
          </div>

          <div className="flex justify-center lg:justify-end w-full order-2 mt-10 lg:mt-0">
            <div className="about-srijan-img relative w-full max-w-[320px] sm:max-w-[380px] aspect-[4/5] mx-auto lg:mx-0">
              {imageSrc ? (
                <div className="absolute inset-x-0 bottom-0 h-[115%] lg:h-[120%] z-10 pointer-events-none">
                  <Image
                    src={imageSrc}
                    alt="Srijan Fashion Mannequin"
                    fill
                    className="object-contain object-bottom rounded-3xl drop-shadow-2xl pointer-events-auto"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-gray-500 font-bold tracking-widest bg-white px-4 py-2 rounded-lg text-sm uppercase shadow-sm border border-gray-100">
                    ABOUT US IMAGE
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