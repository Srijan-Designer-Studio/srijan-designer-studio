"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function CustomizeWedding() {
  const containerRef = useRef(null);

  const bridalProducts = (allProducts || []).filter((product) =>
    product?.category?.includes("Bridal")
  );

  const weddingImages = [
    {
      id: 1,
      src: bridalProducts[0]?.image || "/images/bidalinquery.png",
      alt: bridalProducts[0]?.title || "Pink Bridal Lehenga",
      placeholderBg: "bg-[#fbcfe8]",
      link: "/product", 
    },
    {
      id: 2,
      src: bridalProducts[1]?.image || "/images/product2.png",
      alt: bridalProducts[1]?.title || "Couple Wedding Outfit",
      placeholderBg: "bg-[#fecdd3]",
      link: "/product",
    },
    {
      id: 3,
      src: bridalProducts[2]?.image || "/images/product2.png",
      alt: bridalProducts[2]?.title || "Red Bridal Lehenga",
      placeholderBg: "bg-[#e5e7eb]",
      link: "/product", 
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
          <span className="wed-text text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
            CUSTOMIZE WEDDING WEAR
          </span>
          <h2 className="wed-text text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111] leading-[1.3] mb-6">
            Your Dream Wedding Outfit, Made for You
          </h2>
          <p className="wed-text text-[#444] text-base sm:text-[19px] leading-[1.6] mb-8 max-w-[750px] mx-auto">
            Bring your dream wedding look to life with custom outfits designed
            around your fashion styles, perfect fit and special moments.
          </p>
          <div className="wed-text inline-block">
            <Link
              href="/product"
              className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Now
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {weddingImages.map((img) => (
            <Link href={img.link} key={img.id} className="block">
              <div className="wed-img relative w-full aspect-square sm:aspect-[4/4.5] rounded-[32px] overflow-hidden shadow-lg group cursor-pointer">
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${img.placeholderBg} flex items-center justify-center`}
                  >
                    <span className="text-gray-600 font-bold tracking-widest bg-white/50 px-4 py-2 rounded-lg text-sm uppercase">
                      WEDDING IMAGE {img.id}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}