"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const womenData = [
  { id: 1, title: "Sangeet Edits", imageSrc: "/Custom Wedding Wear/Women Card 1.webp" },
  { id: 2, title: "Engagement Edits", imageSrc: "/Custom Wedding Wear/Women Card 2.webp" },
  { id: 3, title: "Reception Edits", imageSrc: "/Custom Wedding Wear/Women Card 3.webp" },
  { id: 4, title: "Cocktail Edits", imageSrc: "/Custom Wedding Wear/Women Card 4.webp" },
  { id: 5, title: "Haldi Mehendi Edits", imageSrc: "/Custom Wedding Wear/Women Card 5.webp" },
  { id: 6, title: "Pooja Edits", imageSrc: "/Custom Wedding Wear/Women Card 6.webp" },
];

const menData = [
  { id: 11, title: "Sangeet Edits", imageSrc: "/Custom Wedding Wear/Men Card 1.webp" },
  { id: 12, title: "Engagement Edits", imageSrc: "/Custom Wedding Wear/Men Card 2.webp" },
  { id: 13, title: "Reception Edits", imageSrc: "/Custom Wedding Wear/Men Card 3.webp" },
  { id: 14, title: "Cocktail Edits", imageSrc: "/Custom Wedding Wear/Men Card 4.webp" },
  { id: 15, title: "Haldi Mehendi Edits", imageSrc: "/Custom Wedding Wear/Men Card 5.webp" },
  { id: 16, title: "Pooja Edits", imageSrc: "/Custom Wedding Wear/Men Card 6.webp" },
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
          {currentData.map((item) => {

            const slug = item.title.toLowerCase().replace(/\s+/g, '-').replace('-edits', '');

            return (
              <Link
                href={`/occasions/${slug}`}
                key={item.id}
                className="occasion-card flex flex-col items-center cursor-pointer group"
              >
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
                <h3 className="text-[13px] sm:text-[15px] font-bold text-black text-center group-hover:text-[#00c3ff] transition-colors">
                  {item.title}
                </h3>
              </Link>
            );
          })}
        </div>
        <div className="w-full flex items-center justify-center my-2">
          <Link href={"/custom-wedding-wear"}>
            <p className="bg-[#00c3ff] text-white text-sm sm:text-base font-bold px-8 py-3 rounded-full transition-all hover:bg-opacity-90 hover:shadow-md">
              Choose Your Occasion
            </p>
          </Link>
        </div>

      </div>
    </section>
  );
}