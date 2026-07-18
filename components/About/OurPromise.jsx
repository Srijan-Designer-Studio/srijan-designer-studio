"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const promisesData = [
  {
    title: "No Compromises:",
    description: "We use premium fabrics and expert tailoring."
  },
  {
    title: "No Limits:",
    description: "Any size, any style, any design."
  },
  {
    title: "No Delays:",
    description: "Whether it’s a single bridal lehenga or a bulk order of 500 units, we respect the deadline."
  }
];

export default function OurPromise() {
  const containerRef = useRef(null);
  const imageSrc = "/images/ourpromise.png";

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".promise-text",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(
      ".promise-img",
      { x: 50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 lg:py-32 bg-white border-b-[12px] border-[#1a1b41]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <div className="max-w-[600px]">
            <h2 className="promise-text text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-6">
              Our Promise
            </h2>
            <p className="promise-text text-[17px] text-gray-800 leading-relaxed mb-6">
              In a world of fast fashion and copy-paste trends,
              SRIJAN stands for individuality.
            </p>
            <ul className="space-y-4 list-disc pl-5 marker:text-black mb-8">
              {promisesData.map((item, index) => (
                <li key={index} className="promise-text pl-2">
                  <p className="text-[16px] lg:text-[17px] leading-[1.65] text-gray-800">
                    <span className="text-black font-bold">
                      {item.title}
                    </span>{" "}
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="promise-text text-[17px] text-gray-800 leading-relaxed font-semibold italic">
              Welcome to SRIJAN. Come for the fashion. Stay for the fit.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end w-full">
            <div className="promise-img relative w-full max-w-[400px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Srijan Fashion Promise"
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-b from-[#6b6985] to-[#b3b2c2] flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-white/80 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-sm uppercase">
                    PROMISE IMAGE
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