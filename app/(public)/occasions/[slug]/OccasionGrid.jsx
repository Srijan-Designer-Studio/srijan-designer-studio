"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToTop from "@/components/providers/ScrollToTop";

gsap.registerPlugin(ScrollTrigger);

export default function OccasionGrid({ products, title }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".title-anim", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(".product-card-anim", {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none",
      }
    });
  }, { scope: containerRef });

  return (
    <div className="max-w-[1320px] mx-auto px-6" ref={containerRef}>
      <ScrollToTop />

      <h1 className="title-anim text-3xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide capitalize">
        {title}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.length > 0 ? (
          products.map((product) => {
            const imageUrl = product.product_images?.[0]?.image_url;

            return (
              <Link
                href={`/product/${product.slug || product.id}`}
                key={product.id}
                className="product-card-anim group flex flex-col items-center cursor-pointer"
              >
                <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">NO IMAGE</div>
                  )}
                </div>

                <h3 className="text-[15px] font-semibold text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 transition-colors group-hover:text-[#00c3ff]">
                  {product.title}
                </h3>

                <p className="text-[14px] font-bold text-black text-center">
                  ₹{product.base_price?.toLocaleString('en-IN')}
                </p>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10 flex flex-col items-center gap-3">
            <p>No products found for this occasion.</p>
            <Link href="/" className="text-[#00c3ff] hover:underline font-medium">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}