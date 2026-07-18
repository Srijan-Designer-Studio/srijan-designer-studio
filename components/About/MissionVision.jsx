"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const missionVisionData = [
  {
    title: "Mission",
    description: "To turn any design concept into high-quality reality for individuals and brands alike through expert craftsmanship."
  },
  {
    title: "Vision",
    description: "To be the ultimate destination where limitless creativity meets precision manufacturing."
  }
];

export default function MissionVision() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".mv-card",
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-gray-100" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {missionVisionData.map((item, index) => (
            <div
              key={index}
              className="mv-card bg-[#cbe4ff] rounded-[24px] px-8 py-12 lg:px-12 lg:py-16 flex flex-col items-center justify-center text-center shadow-sm"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4">
                {item.title}
              </h3>
              <p className="text-[#333] text-[15px] sm:text-[16px] leading-[1.6] max-w-[450px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}