"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const womenData = [
  { id: 1, title: "Sangeet Edits", imageSrc: "/images/collection1.png" },
  { id: 2, title: "Engagement Edits", imageSrc: "/images/collection2.png" },
  { id: 3, title: "Reception Edits", imageSrc: "/images/collection3.png" },
  { id: 4, title: "Cocktail Edits", imageSrc: "/images/collection4.png" },
  { id: 5, title: "Haldi Mehendi Edits", imageSrc: "/images/collection5.png" },
  { id: 6, title: "Pooja Edits", imageSrc: "/images/collection6.png" },
];

const menData = [
  { id: 11, title: "Sangeet Edits", imageSrc: "/images/man1.png" },
  { id: 12, title: "Engagement Edits", imageSrc: "/images/man2.png" },
  { id: 13, title: "Reception Edits", imageSrc: "/images/man3.png" },
  { id: 14, title: "Cocktail Edits", imageSrc: "/images/man4.png" },
  { id: 15, title: "Haldi Mehendi Edits", imageSrc: "/images/man5.png" },
  { id: 16, title: "Pooja Edits", imageSrc: "/images/man6.png" },
];

export default function OccasionsEdit() {
  const [activeTab, setActiveTab] = useState("WOMEN");
  const containerRef = useRef(null);

  const currentData = activeTab === "WOMEN" ? womenData : menData;

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".occasion-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".occasion-btn",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  useGSAP(() => {
    gsap.fromTo(
      ".occasion-card",
      { y: 30, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
    );
  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col items-center">

        <h2 className="occasion-head text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
          Choose Edit By Occassions
        </h2>

        <div className="occasion-head flex items-center gap-8 mb-12">
          <button
            onClick={() => setActiveTab("WOMEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 border-b-2 transition-colors ${activeTab === "WOMEN" ? "text-black border-black font-bold" : "text-gray-500 border-transparent hover:text-black font-medium"
              }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => setActiveTab("MEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 border-b-2 transition-colors ${activeTab === "MEN" ? "text-black border-black font-bold" : "text-gray-500 border-transparent hover:text-black font-medium"
              }`}
          >
            MEN
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 w-full mb-12">
          {currentData.map((item) => (
            <div key={item.id} className="occasion-card flex flex-col items-center cursor-pointer group">
              <div className="relative w-full aspect-[3/4] rounded-[16px] bg-[#293645] overflow-hidden mb-4 transition-shadow hover:shadow-xl">
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="text-[13px] sm:text-[15px] font-bold text-black text-center">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        <button className="occasion-btn px-8 py-3.5 bg-[#00c3ff] text-white rounded-full font-bold text-[13px] tracking-wide hover:bg-[#00a0d6] transition-colors shadow-md">
          Choose Your Occassion
        </button>

      </div>
    </section>
  );
}