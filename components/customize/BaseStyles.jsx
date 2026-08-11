"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function BaseStyles() {
  const containerRef = useRef(null);

  const customProduct = allProducts.find(p => p.category.includes("Ethnic"));
  const gownProduct = allProducts.find(p => p.slug?.includes("gown")) || allProducts[0];
  const plusSizeProduct = allProducts.find(p => p.category.includes("Western"));
  const petiteProduct = allProducts.find(p => p.category === "Bridal");

  const styles = [
    { id: 1, title: "Custom Styles", image: customProduct?.image, link: customProduct ? `/product/${customProduct.id}` : "/product" },
    { id: 2, title: "Gown & Evening Styles", image: gownProduct?.image, link: gownProduct ? `/product/${gownProduct.id}` : "/product" },
    { id: 3, title: "Plus Size Styles", image: plusSizeProduct?.image, link: plusSizeProduct ? `/product/${plusSizeProduct.id}` : "/product" },
    { id: 4, title: "Petite Styles", image: petiteProduct?.image, link: petiteProduct ? `/product/${petiteProduct.id}` : "/product" }
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
      ".base-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".base-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.4"
    ).fromTo(
      ".base-btn",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 text-center">

        <h2 className="base-title text-3xl font-bold text-black mb-10">Start With a Base Style</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {styles.map((style) => (
            <Link
              href={style.link}
              key={style.id}
              className="base-card flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200 transition-shadow group-hover:shadow-lg">
                {style.image && (
                  <Image
                    src={style.image}
                    alt={style.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-[#00c3ff] transition-colors">
                {style.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="base-btn">
          <Link href="/shop-style">
            <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md hover:-translate-y-1 transition-transform">
              Choose Your Style
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}