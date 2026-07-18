"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const weddingProducts = [
  { id: 1, imageSrc: "/images/collection1.png" },
  { id: 2, imageSrc: "/images/collection2.png" },
  { id: 3, imageSrc: "/images/collection3.png" },
];

export default function WeddingCollection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".wed-coll-text",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(
      ".wed-coll-img",
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-[#f4f5f8]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="w-full lg:w-1/3">
            <h2 className="wed-coll-text text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
              Crafted for Your <br className="hidden lg:block" /> Special Day
            </h2>
            <p className="wed-coll-text text-[#333] text-[16px] leading-relaxed mb-8">
              Every wedding dress is crafted with care, comfort and timeless style.
            </p>
            <div className="wed-coll-text">
              <Link
                href="/wedding"
                className="inline-flex items-center gap-3 text-[#1070c0] font-bold text-[14px] uppercase tracking-wide transition-opacity hover:opacity-80"
              >
                SHOP OUR COLLECTION
                <ArrowRight size={22} strokeWidth={2.5} className="text-black" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {weddingProducts.map((product) => (
                <div
                  key={product.id}
                  className="wed-coll-img relative w-full aspect-[3/4] bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {product.imageSrc && (
                    <Image
                      src={product.imageSrc}
                      alt="Wedding Dress"
                      fill
                      className="object-cover object-top"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}