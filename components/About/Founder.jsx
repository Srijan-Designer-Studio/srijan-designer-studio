"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const containerRef = useRef(null);
  const imageSrc = "/About-img/Founder.webp";

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
    <section className="py-16 lg:py-32 bg-gradient-to-br from-[#34365A] via-[#35375B] to-[#808197]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">


          <div className="lg:col-span-7 max-w-[650px] order-1 lg:order-2">
            <h2 className="founder-text text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              A WORD FROM THE FOUNDER
            </h2>
            <h3 className="founder-text text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-[1.3] mb-6">
              Mithu Roy — Founder, <br className="hidden sm:block" />
              SRIJAN Fashion
            </h3>
            <p className="founder-text text-[19px] lg:text-[18px] text-gray-100 leading-[1.7]">
              We didn't start <span className="font-bold ">SRIJAN</span> to make clothes.
              We started it so you'd feel like the best
              version of yourself every time you got
              dressed. Confident. Comfortable.
              Completely you. That's still the only goal
              that matters to us. Thanks for being part
              of the story.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-start w-full order-2 lg:order-1 mt-6 lg:mt-0">
            <div className="founder-img relative w-full max-w-[360px] lg:max-w-[500px] aspect-[3/2] overflow-hidden mx-auto lg:mx-0">
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

        </div>
      </div>
    </section>
  );
}