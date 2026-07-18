"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function SimilarProducts({ currentCategory, currentProductId }) {
  const containerRef = useRef(null);

  const similarProductsData = allProducts
    .filter(
      (product) =>
        product.category === currentCategory &&
        product.id !== currentProductId
    )
    .slice(0, 4);

  useGSAP(() => {
    if (similarProductsData.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".sim-head",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".sim-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.3"
    );
  }, { scope: containerRef, dependencies: [similarProductsData] });

  if (similarProductsData.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <h2 className="sim-head text-2xl sm:text-3xl font-bold text-center text-black uppercase tracking-wide mb-12">
          Similar Products
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {similarProductsData.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="sim-card group flex flex-col items-center cursor-pointer"
            >
              <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                    NO IMAGE
                  </div>
                )}
              </div>

              <h3 className="text-[12px] sm:text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 group-hover:text-[#00c3ff] transition-colors">
                {product.title}
              </h3>

              <p className="text-[13px] sm:text-[14px] font-bold text-black text-center">
                {product.price?.toString().includes('₹') ? product.price : `₹${product.price}`}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}