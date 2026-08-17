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

  
  const sortedProducts = [...products].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0; 
  });

  const womenProducts = sortedProducts
    .filter((product) => {
      const cat = product.categories?.name?.toLowerCase() || '';
      return cat.includes("women") || cat.includes("sarees") || cat.includes("lehengas") || cat.includes("bridal");
    })
    .slice(0, 4);

  const menProducts = sortedProducts
    .filter((product) => {
      const cat = product.categories?.name?.toLowerCase() || '';
      return (cat.includes("men") && !cat.includes("women")) || cat.includes("kurtas") || cat.includes("suits");
    })
    .slice(0, 4);

  const currentProducts = activeTab === "WOMEN" ? womenProducts : menProducts;

  useGSAP(() => {
    gsap.fromTo(
      ".essentials-title",
      { y: 40, opacity: 0 },
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
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: "power2.out",
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
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { dependencies: [activeTab], scope: containerRef });

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
    return () => clearTimeout(timer);
  }, [activeTab, products]);

  return (
    <section className="py-24 bg-[#fafafa]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-14">
          <div className="overflow-hidden mb-2">
           
            <h2 className="essentials-title text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
             SHOP ESSENTIALS
            </h2>
          </div>

          <div className="essentials-tabs flex items-center justify-center gap-8 mt-10">
            <button
              onClick={() => setActiveTab("WOMEN")}
              className={`relative text-sm md:text-base font-bold tracking-widest uppercase transition-colors duration-300 py-2 ${
                activeTab === "WOMEN" ? "text-black" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Women
              {activeTab === "WOMEN" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-black rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("MEN")}
              className={`relative text-sm md:text-base font-bold tracking-widest uppercase transition-colors duration-300 py-2 ${
                activeTab === "MEN" ? "text-black" : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Men
              {activeTab === "MEN" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-black rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-12 font-medium">
              No new arrivals found in this category yet.
            </p>
          ) : (
            currentProducts.map((product) => {
              const mainImage = product.product_images?.[0]?.image_url;
              const categoryName = product.categories?.name || "Exclusive";

              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="product-card group flex flex-col cursor-pointer">

                  {/* Image Container */}
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                    
                    {/* NEW Badge */}
                    <div className="absolute top-4 left-4 z-10 bg-black/90 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-md">
                      NEW
                    </div>

                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold tracking-widest">
                        NO IMAGE
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col text-left px-1">
                    <span className="text-[11px] font-extrabold text-gray-400 tracking-widest uppercase mb-1.5">
                      {categoryName}
                    </span>
                    <h3 className="text-[16px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#00c3ff] line-clamp-1 mb-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-[17px] font-black text-black">
                        ₹{product.base_price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

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