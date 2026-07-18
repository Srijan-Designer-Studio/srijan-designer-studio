"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductCard({ product }) {
  const cardRef = useRef(null);

  // Destructuring both 'name' and 'title' to support different data structures
  const { id, name, title, price, originalPrice, image, slug, badge } = product;
  const displayName = name || title;

  useGSAP(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col overflow-hidden rounded-[16px] border border-gray-200 bg-white transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Product Image */}
      <Link href={`/product/${slug || id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded bg-red-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
            {badge}
          </span>
        )}
        <Image
          src={image || "/images/product-placeholder.png"}
          alt={displayName || "Product Image"}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col gap-1 p-4 items-center">
        <Link href={`/product/${slug || id}`}>
          <h3 className="text-[13px] sm:text-[14px] text-center font-medium text-gray-800 line-clamp-2 group-hover:text-[#00c3ff] transition-colors leading-[1.4]">
            {displayName}
          </h3>
        </Link>

        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span className="text-[14px] sm:text-[15px] font-bold text-black">
            ₹{typeof price === 'number' ? price.toLocaleString('en-IN') : price}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-[12px] text-gray-500 line-through">
              ₹{typeof originalPrice === 'number' ? originalPrice.toLocaleString('en-IN') : originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}