"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const womenData = [
  { id: 1, title: "Sarees", imageSrc: "/images/western1.png", link: "/buy-designer-outfits-for-women-online" },
  { id: 2, title: "Gowns", imageSrc: "/images/western2.png", link: "/buy-designer-outfits-for-women-online" },
  { id: 3, title: "Drapes", imageSrc: "/images/western3.png", link: "/buy-designer-outfits-for-women-online" },
  { id: 4, title: "Capes", imageSrc: "/images/western4.png", link: "/buy-designer-outfits-for-women-online" },
  { id: 5, title: "Bridal Suits", imageSrc: "/images/western5.png", link: "/wedding" },
];

const menData = [
  { id: 11, title: "Sherwanis", imageSrc: "/images/man1.png", link: "/ethnic-wear" },
  { id: 12, title: "Kurta Sets", imageSrc: "/images/man2.png", link: "/ethnic-wear" },
  { id: 13, title: "Nehru Jackets", imageSrc: "/images/man3.png", link: "/ethnic-wear" },
  { id: 14, title: "Bandhgalas", imageSrc: "/images/man4.png", link: "/ethnic-wear" },
  { id: 15, title: "Tuxedos", imageSrc: "/images/man5.png", link: "/wedding" },
];

export default function EditByCategory() {
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
      ".edit-category-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    gsap.fromTo(
      ".edit-category-item",
      { y: 40, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power4.out" }
    );
  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <section className="py-16 bg-gradient-to-b from-[#2d2f4d] to-[#6a6787]" ref={containerRef}>
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-10 w-full max-w-[1000px] mx-auto">
          {currentData.map((category) => (
            <Link key={category.id} href={category.link} className="edit-category-item flex flex-col items-center cursor-pointer group">
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
              <span className="text-white text-[14px] font-medium tracking-wide">
                {category.title}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}