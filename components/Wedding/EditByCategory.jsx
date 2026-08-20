"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const womenData = [
  { id: 1, title: "Sarees", imageSrc: "/Custom Wedding Wear/Sarees.webp" },
  { id: 2, title: "Gowns", imageSrc: "/Custom Wedding Wear/Gowns.webp" },
  { id: 3, title: "Drapes", imageSrc: "/Custom Wedding Wear/Drapes.webp" },
  { id: 4, title: "Capes", imageSrc: "/Custom Wedding Wear/Capes.webp" },
  { id: 5, title: "Bridal Suits", imageSrc: "/Custom Wedding Wear/Bridal Suits.webp" },
  { id: 6, title: "Lehengas", imageSrc: "/Custom Wedding Wear/Lahengas.webp" },
];

const menData = [
  { id: 11, title: "Indo western", imageSrc: "/Custom Wedding Wear/Indowestern.webp" },
  { id: 12, title: "Kurta Sets", imageSrc: "/Custom Wedding Wear/Kurta.webp" },
  { id: 13, title: "Sherwani", imageSrc: "/Custom Wedding Wear/Sherwani.webp" },
  { id: 14, title: "Tuxedo", imageSrc: "/Custom Wedding Wear/Tuxedo.webp" },
  { id: 15, title: "Shirt", imageSrc: "/Custom Wedding Wear/Shirt.webp" },
];

export default function EditByCategory() {
  const [activeTab, setActiveTab] = useState("WOMEN");
  const containerRef = useRef(null);
  const marqueeTween = useRef(null);

  const currentData = activeTab === "WOMEN" ? womenData : menData;
  const extendedData = [...currentData, ...currentData];

  useGSAP(() => {
    gsap.fromTo(
      ".edit-category-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    gsap.fromTo(
      ".edit-category-item",
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "power4.out" }
    );

    const marqueeTl = gsap.timeline({ repeat: -1 });
    const totalCards = extendedData.length;
    const stepPercentage = 50 / totalCards;

    for (let i = 1; i <= totalCards; i++) {
      marqueeTl.to(".marquee-track", {
        xPercent: -(stepPercentage * i),
        duration: 0.8,
        ease: "power2.inOut"
      }, "+=2");
    }
    
    marqueeTween.current = marqueeTl;

  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <section className="py-16 bg-gradient-to-b from-[#2d2f4d] to-[#6a6787] overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col items-center">

        <h2 className="edit-category-head text-3xl font-bold text-white mb-6">
          Edit By Category
        </h2>

        <div className="edit-category-head flex items-center gap-6 mb-12">
          <button
            onClick={() => setActiveTab("WOMEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 transition-colors ${activeTab === "WOMEN" ? "text-white border-b-2 border-white font-bold" : "text-gray-300 border-b-2 border-transparent hover:text-white"
              }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => setActiveTab("MEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 transition-colors ${activeTab === "MEN" ? "text-white border-b-2 border-white font-bold" : "text-gray-300 border-b-2 border-transparent hover:text-white"
              }`}
          >
            MEN
          </button>
        </div>

        <div className="w-full relative mx-auto overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] py-4">
          <div 
            className="marquee-track flex w-max"
            onMouseEnter={() => marqueeTween.current?.pause()}
            onMouseLeave={() => marqueeTween.current?.play()}
          >
            <div className="flex gap-6 sm:gap-10 pr-6 sm:pr-10">
              {extendedData.map((category, index) => (
                <div key={`set1-${category.id}-${index}`} className="edit-category-item flex flex-col items-center group w-[130px] sm:w-[150px] md:w-[170px] shrink-0">
                  <div className="relative w-full aspect-square rounded-full bg-[#1a1c33] overflow-hidden mb-4 border-[3px] border-transparent group-hover:border-white transition-all shadow-lg">
                    {category.imageSrc && (
                      <Image
                        src={category.imageSrc}
                        alt={category.title}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <h3 className="text-white text-[14px] font-medium tracking-wide">
                    {category.title}
                  </h3>
                </div>
              ))}
            </div>

            <div className="flex gap-6 sm:gap-10 pr-6 sm:pr-10">
              {extendedData.map((category, index) => (
                <div key={`set2-${category.id}-${index}`} className="edit-category-item flex flex-col items-center group w-[130px] sm:w-[150px] md:w-[170px] shrink-0">
                  <div className="relative w-full aspect-square rounded-full bg-[#1a1c33] overflow-hidden mb-4 border-[3px] border-transparent group-hover:border-white transition-all shadow-lg">
                    {category.imageSrc && (
                      <Image
                        src={category.imageSrc}
                        alt={category.title}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <h3 className="text-white text-[14px] font-medium tracking-wide">
                    {category.title}
                  </h3>
                </div>
              ))}
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}