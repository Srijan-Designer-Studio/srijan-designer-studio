"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ShopEssentials = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState("WOMEN");
  const containerRef = useRef(null);

  const womenProducts = products
    .filter((product) => {
      const cat = product.categories?.name?.toLowerCase() || '';
      return cat.includes("women") || cat.includes("sarees") || cat.includes("lehengas") || cat.includes("bridal");
    })
    .slice(0, 8);

  const menProducts = products
    .filter((product) => {
      const cat = product.categories?.name?.toLowerCase() || '';
      return (cat.includes("men") && !cat.includes("women")) || cat.includes("kurtas") || cat.includes("suits");
    })
    .slice(0, 8);

  const currentProducts = activeTab === "WOMEN" ? womenProducts : menProducts;

  useGSAP(() => {
    gsap.fromTo(
      ".essentials-title",
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1, ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      }
    );

    gsap.fromTo(
      ".essentials-tabs",
      { opacity: 0 },
      {
        opacity: 1, duration: 0.8, delay: 0.3, ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    gsap.fromTo(
      ".product-card",
      { y: 60, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { dependencies: [activeTab], scope: containerRef });

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, products]);

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <div className="text-center mb-12">
          <div className="overflow-hidden">
            <h2 className="essentials-title text-2xl md:text-4xl font-extrabold text-black uppercase tracking-wider mb-6">
              SHOP ESSENTIALS
            </h2>
          </div>

          <div className="essentials-tabs flex items-center justify-center gap-8">
            <button
              onClick={() => setActiveTab("WOMEN")}
              className={`text-base md:text-lg tracking-wide uppercase transition-all duration-300 ${activeTab === "WOMEN"
                ? "font-semibold text-black border-b-2 border-black pb-1"
                : "text-gray-500 hover:text-black pb-1"
                }`}
            >
              WOMEN
            </button>
            <button
              onClick={() => setActiveTab("MEN")}
              className={`text-base md:text-lg tracking-wide uppercase transition-all duration-300 ${activeTab === "MEN"
                ? "font-semibold text-black border-b-2 border-black pb-1"
                : "text-gray-500 hover:text-black pb-1"
                }`}
            >
              MEN
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">
              No products found in this category.
            </p>
          ) : (
            currentProducts.map((product) => {
              const mainImage = product.product_images?.[0]?.image_url;

              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="product-card group flex flex-col items-center text-center cursor-pointer">

                  <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-400 overflow-hidden mb-4 bg-white transition-shadow duration-300 group-hover:shadow-xl">
                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm font-semibold tracking-wide">
                        NO IMAGE
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-medium leading-[1.4] text-gray-800 px-2 min-h-[42px] transition-colors group-hover:text-[#00c3ff] line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-lg font-bold text-black mt-3">
                    ₹{product.base_price?.toLocaleString('en-IN')}
                  </p>

                </Link>
              )
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default ShopEssentials;