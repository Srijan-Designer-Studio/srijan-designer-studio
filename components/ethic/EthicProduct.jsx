"use client";

import { useRef } from "react";
import { products } from "@/data/products";
import EthnicProductCard from "./EthnicProductCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EthicProduct = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".ethnic-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".ethnic-card-wrapper",
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="max-w-[1320px] mx-auto py-20 px-6" ref={containerRef}>

      <div className="overflow-hidden mb-12 lg:mb-16">
        <h2 className="ethnic-title text-4xl md:text-[55px] text-center font-bold font-serif text-[#111]">
          Ethnic Wear
        </h2>
      </div>

      {/* Made grid responsive for mobile, tablet, and desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {products.map((item) => (
          <div key={item.id} className="ethnic-card-wrapper">
            <EthnicProductCard item={item} />
          </div>
        ))}
      </div>

    </section>
  );
};

export default EthicProduct;