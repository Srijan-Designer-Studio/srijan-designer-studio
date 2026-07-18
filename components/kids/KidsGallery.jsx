"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function KidsGallery() {
  const containerRef = useRef(null);

  const galleryItems = allProducts.slice(0, 10).map((prod, i) => ({
    ...prod,
    styleClass:
      i === 0 ? "col-span-1 row-span-1" :
        i === 1 ? "col-span-1 row-span-1" :
          i === 2 ? "col-span-2 row-span-2 hidden md:block" :
            i === 3 ? "col-span-2 row-span-2 hidden lg:block" :
              i === 4 ? "col-span-1 row-span-1" :
                i === 5 ? "col-span-1 row-span-1" :
                  "col-span-1 row-span-1"
  }));

  useGSAP(() => {
    gsap.fromTo(
      ".gallery-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 80%", toggleActions: "play none none reverse" } }
    );

    gsap.fromTo(
      ".gallery-item",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out", scrollTrigger: { trigger: ".gallery-grid", start: "top 85%", toggleActions: "play none none reverse" } }
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="gallery-head text-3xl md:text-4xl font-bold text-black mb-12">Our Click Gallery</h2>

        <div className="gallery-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {galleryItems.map((item, idx) => (
            <Link
              href={`/product/${item.id}`}
              key={idx}
              className={`gallery-item relative rounded-xl overflow-hidden bg-gray-100 group shadow-sm ${item.styleClass}`}
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt="Gallery image"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}