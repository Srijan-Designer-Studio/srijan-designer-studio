"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SimilarProducts({ similarProducts = [] }) {
  const containerRef = useRef(null);

  const hasProducts = similarProducts && similarProducts.length > 0;

  useGSAP(() => {
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
    );

    if (hasProducts) {
      tl.fromTo(
        ".sim-card",
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
        "-=0.3"
      );
    } else {
      tl.fromTo(
        ".sim-empty",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      );
    }
  }, { scope: containerRef, dependencies: [similarProducts] });


  return (
    <section className="py-16 bg-[#fafafa]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <h2 className="sim-head text-2xl sm:text-3xl font-bold text-center text-black uppercase tracking-widest mb-12">
          SIMILAR PRODUCTS
        </h2>

        {hasProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {similarProducts.slice(0, 4).map((product) => {
              const imageUrl = product.product_images?.[0]?.image_url || null;
              
              const basePrice = Number(product.base_price) || 0;
              const salePrice = Number(product.sale_price) || 0;
              const hasDiscount = salePrice > 0 && salePrice < basePrice;
              const displayPrice = hasDiscount ? salePrice : basePrice;

              return (
                <Link
                  href={`/product/${product.slug}`}
                  key={product.id}
                  className="sim-card group flex flex-col items-center cursor-pointer"
                >
                  <div className="relative w-full aspect-[2/3] rounded-[16px] border border-gray-200 overflow-hidden mb-4 bg-white transition-shadow duration-300 group-hover:shadow-xl">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.title || "Product"}
                        fill
                        unoptimized
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  <h3 className="text-[13px] sm:text-[14px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 group-hover:text-[#00c3ff] transition-colors">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-center gap-2">
                    <p className="text-[15px] sm:text-[16px] font-bold text-black text-center">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </p>
                    {hasDiscount && (
                      <p className="text-[13px] sm:text-[14px] font-medium text-gray-400 line-through text-center">
                        ₹{basePrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="sim-empty flex justify-center items-center h-32 bg-white rounded-[16px] border border-gray-200 shadow-sm">
            <p className="text-gray-500 font-medium italic">No similar products available right now.</p>
          </div>
        )}

      </div>
    </section>
  );
}