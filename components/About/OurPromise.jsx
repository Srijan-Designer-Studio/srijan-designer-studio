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
    description: "Premium fabric. Expert tailoring. Every single time."
  },
  {
    title: "No Limits:",
    description: "Any size. Any style. Any design you can dream up."
  },
  {
    title: "No Delays:",
    description: "One lehenga or five hundred pieces, your deadline is our deadline."
  }
];

export default function OurPromise() {
  const containerRef = useRef(null);
  const imageSrc = "/About-img/13.webp";

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
    <section className="py-16 lg:py-32 bg-white border-b-[12px] border-[#1a1b41]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          <div className="max-w-[600px] order-1">
            <h2 className="promise-text text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-6">
              Our Promise
            </h2>
            <p className="promise-text text-[16px] lg:text-[19px] text-gray-800 leading-relaxed mb-6">
              Fast fashion moves fast. We move on purpose. <br />

              While everyone else is copying trends, we're busy copying
              nothing. Every <span className="font-bold">SRIJAN</span> piece is built around one person, you.
            </p>
            <ul className="space-y-4 list-disc pl-5 marker:text-black mb-8">
              {promisesData.map((item, index) => (
                <li key={index} className="promise-text pl-2">
                  <p className="text-[19px] lg:text-[17px] leading-[1.65] text-gray-800">
                    <span className="text-black font-bold">
                      {item.title}
                    </span>{" "}
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="promise-text text-[16px] lg:text-[19px] text-gray-800 leading-relaxed font-semibold italic">
              This is SRIJAN. Come for the fashion. Stay because it finally fits.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end w-full order-2 mt-6 lg:mt-0">
            <div className="promise-img relative w-full max-w-[320px] sm:max-w-[380px] aspect-[4/5] mx-auto lg:mx-0">
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
                    OUR PROMISE IMAGE
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