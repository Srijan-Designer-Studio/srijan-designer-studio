"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";
import CustomStylesPopup from "@/components/customPopUp/CustomStylesPopup";

gsap.registerPlugin(ScrollTrigger);

export default function CustomizeWedding() {
  const containerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Women");

  const bridalProducts = (allProducts || []).filter((product) =>
    product?.category?.includes("Bridal")
  );

  const openPopup = (category) => {
    setSelectedCategory(category);
    setIsPopupOpen(true);
  };

  const weddingImages = [
    {
      id: 1,
      src: "/Home_img/8.webp",
      alt: "Custom For Women",
      category: "Women",

    },
    {
      id: 2,
      src: "/Home_img/9.webp",
      alt: "Custom For Men",
      category: "Men",

    },
    {
      id: 3,
      src: "/Home_img/10.webp",
      alt: "Custom For Groom",
      category: "Groom",

    },
  ];

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".wed-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      ).fromTo(
        ".wed-img",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <div className="max-w-[850px] mx-auto mb-12">
          <h2 className="wed-text text-[#ff3838] font-bold uppercase tracking-wider text-xl sm:text-base mb-4 block">
            CUSTOMIZE WEDDING WEAR
          </h2>
          <h3 className="wed-text text-2xl sm:text-4xl lg:text-[42px] font-bold text-[#111] leading-[1.3] mb-6">
            One Day. One Dress. Made Only for You
          </h3>
          <p className="wed-text text-[#444] text-lg sm:text-[19px] leading-[1.6] mb-8 max-w-[750px] mx-auto">
            Your wedding look shouldn't come off a rack. Get a custom outfit built around
            your story, your fit and every little detail you've been dreaming about.
          </p>
          <div className="wed-text inline-block">
            {/* <button
              onClick={() => openPopup("Women")}
              className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            >
              Explore Now
              <ArrowRight size={18} strokeWidth={2.5} />
            </button> */}

            <Link href="/create-custom-wedding-wear" className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
              Explore Now
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {weddingImages.map((img) => (
            <div
              key={img.id}
              onClick={() => openPopup(img.category)}
              className="block w-full"
            >
              <div className="wed-img relative w-full aspect-square rounded-[32px] overflow-hidden shadow-lg group cursor-pointer bg-gray-100">
                {img.src && (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <CustomStylesPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        category={selectedCategory}
      /> */}
    </section>
  );
}