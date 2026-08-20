"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { allProducts } from '@/data/products';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ShopWesternWear() {
  const containerRef = useRef(null);

  const productsData = allProducts
    .filter((product) => product.category === "Western")
    .slice(0, 4);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".shop-west-head",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".shop-west-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.3"
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 bg-white border-b border-gray-200" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <div className="shop-west-head flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#111]">
            Shop Western Wear
          </h2>
          <Link
            href="/western-wear"
            className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {productsData.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="shop-west-card group flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-400 overflow-hidden mb-4 bg-white transition-shadow duration-300 group-hover:shadow-xl">
                {(product.imageSrc || product.image) && (
                  <Image
                    src={product.imageSrc || product.image}
                    alt={product.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="text-[12px] sm:text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-3">
                {product.title}
              </h3>
              <p className="text-[19px] sm:text-[14px] font-bold text-black text-center">
                {product.price?.toString().includes('₹') ? product.price : `₹${product.price}`}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}