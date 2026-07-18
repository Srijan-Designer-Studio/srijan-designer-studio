"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function ShopStyles() {
  const containerRef = useRef(null);

  const displayProducts = allProducts.slice(0, 12);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".style-head",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".style-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
      "-=0.3"
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        {/* Section Heading */}
        <h2 className="style-head text-2xl sm:text-3xl font-bold text-center text-[#111] mb-10">
          Shop Styles
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {displayProducts.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="style-card group flex flex-col items-center cursor-pointer"
            >

              {/* Product Image Container */}
              <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Product Title */}
              <h3 className="text-[12px] sm:text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2">
                {product.title}
              </h3>

              {/* Product Price */}
              <p className="text-[13px] sm:text-[14px] font-bold text-black text-center">
                {product.price?.toString().includes('₹') ? product.price : `₹${product.price}`}
              </p>

            </Link>
          ))}
        </div>

        {/* Bottom Pagination / Slider Indicators */}
        <div className="style-head flex items-center justify-center gap-2 mt-12">
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer"></span>
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer opacity-40 hover:opacity-100 transition-opacity"></span>
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer opacity-40 hover:opacity-100 transition-opacity"></span>
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer opacity-40 hover:opacity-100 transition-opacity"></span>
        </div>

      </div>
    </section>
  );
}