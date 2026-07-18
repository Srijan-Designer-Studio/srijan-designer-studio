"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function KidsLooks() {
  const containerRef = useRef(null);

  const getProduct = (index) => allProducts[index % allProducts.length];

  const looks = [
    { id: 1, title: "Party Perfect Clicks", prod: getProduct(0) },
    { id: 2, title: "Everyday Happy Clicks", prod: getProduct(1) },
    { id: 3, title: "Magical Theme Clicks", prod: getProduct(2) },
    { id: 4, title: "First Birthday Clicks", prod: getProduct(3) },
    { id: 5, title: "Picture-Perfect Gown Clicks", prod: getProduct(4) },
    { id: 6, title: "Festive Ethnic Clicks", prod: getProduct(5) },
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
      ".look-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".look-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.4"
    ).fromTo(
      ".look-btn",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="look-head text-3xl md:text-4xl font-bold text-black mb-12">Choose Click By Looks</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {looks.map((look) => (
            <Link
              href={`/product/${look.prod.id}`}
              key={look.id}
              className="look-card group flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100">
                {look.prod.image && (
                  <Image
                    src={look.prod.image}
                    alt={look.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
              </div>
              <h3 className="text-lg font-bold text-black group-hover:text-[#00c3ff] transition-colors">
                {look.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="look-btn">
          <Link href="/product">
            <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3.5 px-10 rounded-full transition-colors shadow-md">
              Choose Your Look
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}