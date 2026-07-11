"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { allProducts } from '@/data/products'; 

const ShopEssentials = () => {
  const [activeTab, setActiveTab] = useState("WOMEN");

  const womenProducts = allProducts
    .filter((product) => product.category.includes("Women") || product.category === "Bridal")
    .slice(0, 4); 

 
  const menProducts = allProducts
    .filter((product) => product.category.includes("Men"))
    .slice(0, 4);

 
  const currentProducts = activeTab === "WOMEN" ? womenProducts : menProducts;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        
        {/* Header and Tabs */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-wider mb-6">
            SHOP ESSENTIALS
          </h2>
          
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => setActiveTab("WOMEN")}
              className={`text-base md:text-lg tracking-wide uppercase transition-all duration-300 ${
                activeTab === "WOMEN"
                  ? "font-semibold text-black border-b-2 border-black pb-1"
                  : "text-gray-500 hover:text-black pb-1"
              }`}
            >
              WOMEN
            </button>
            <button
              onClick={() => setActiveTab("MEN")}
              className={`text-base md:text-lg tracking-wide uppercase transition-all duration-300 ${
                activeTab === "MEN"
                  ? "font-semibold text-black border-b-2 border-black pb-1"
                  : "text-gray-500 hover:text-black pb-1"
              }`}
            >
              MEN
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">
              No products found in this category.
            </p>
          ) : (
            currentProducts.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col items-center text-center cursor-pointer">
                
                {/* Product Image Box */}
                <div className="relative w-full aspect-[3/4] max-h-[420px] rounded-3xl border border-gray-400 overflow-hidden mb-5 bg-gray-100">
                  {product.image ? ( 
                    <Image
                      src={product.image}
                      alt={product.title} 
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400 font-bold tracking-wider px-4 text-sm uppercase">
                        NO IMAGE
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <h3 className="text-[15px] leading-[1.4] text-gray-800 px-2 min-h-[42px] transition-colors group-hover:text-[#00c3ff] line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-lg font-bold text-black mt-3">
                  {product.price}
                </p>
                
              </Link>
            ))
          )}

        </div>

      </div>
    </section>
  );
}

export default ShopEssentials;