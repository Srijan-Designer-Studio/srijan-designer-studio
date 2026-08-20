"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { allProducts } from '@/data/products';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Collection() {
  const containerRef = useRef(null);

  const ethnicCover = "/Home_img/4.webp";
  const westernCover = "/Home_img/5.webp";
  const newArrivalCover = "/Home_img/6.webp";

  const collections = [
    { id: 1, buttonText: "Shop Ethnic Wear", placeholderBg: "bg-[#2dd4bf]", imageSrc: ethnicCover, link: "/ethnic-wear" },
    { id: 2, buttonText: "Shop Western Wear", placeholderBg: "bg-[#38bdf8]", imageSrc: westernCover, link: "/western-wear" },
    { id: 3, buttonText: "Shop New Arrival", placeholderBg: "bg-[#fb7185]", imageSrc: newArrivalCover, link: "/new-arrivals" },
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".coll-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".coll-card",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-[#0e0c29] via-[#1a1b41] to-[#8f90a6]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="coll-head flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-2xl md:text-4xl lg:text-[42px] font-bold text-white uppercase tracking-wide">
            SHOP BY COLLECTION
          </h2>
          <Link
            href="/shop-style"
            className="flex items-center gap-1 text-white text-sm md:text-base hover:text-[#00c3ff] transition-colors duration-300 uppercase tracking-wider"
          >
            SHOP ALL COLLECTIONS
            <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((item) => (
            <Link href={item.link} key={item.id} className="coll-card block">
              <div className="relative w-full aspect-[2/3] rounded-[24px] overflow-hidden shadow-xl group cursor-pointer">
                {item.imageSrc ? (
                  <Image
                    src={item.imageSrc}
                    alt={item.buttonText}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className={`w-full h-full ${item.placeholderBg} flex items-center justify-center`}>
                    <span className="text-white font-bold bg-black/20 px-4 py-2 rounded-md">
                      NO IMAGE
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 w-full flex justify-center px-4">
                  <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] lg:text-[17px] py-3 px-6 w-full max-w-[280px] rounded-full transition-all duration-300 shadow-lg">
                    {item.buttonText}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}