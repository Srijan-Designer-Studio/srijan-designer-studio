"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Minus, Plus } from "lucide-react";


import { allProducts } from "@/data/products"; 

export default function ProductDetails({ id }) {
  const [size, setSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

 
  const product = allProducts.find((item) => item.id.toString() === id?.toString());

  
  if (!product) {
    return (
      <div className="py-32 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found!</h2>
        <p className="text-gray-500">The product you are looking for does not exist.</p>
      </div>
    );
  }
  // ============================================

  const sizes = ["S", "M", "L", "XL", "XXL"];
  
  const tabs = [
    { id: "description", label: "Description" },
    { id: "material", label: "Material & Care" },
    { id: "shipping", label: "Shipping Policy" },
    { id: "return", label: "Return/Exchange Policy" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          
          <div className="w-full max-w-[500px] mx-auto lg:mx-0">
            <div className="relative w-full aspect-[3/4] rounded-[24px] border border-gray-200 overflow-hidden mb-6 bg-gray-50">
              
            
              {product.image && (
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  className="object-cover object-top"
                />
              )}

            </div>
          </div>

          <div className="flex flex-col pt-2">
            
           
            <h1 className="text-3xl lg:text-[34px] font-bold text-black leading-[1.2] mb-4">
              {product.title}
            </h1>
            
            <p className="text-2xl font-bold text-black mb-6">
              {product.price}
            </p>
            
            <p className="text-[15px] text-[#333] leading-relaxed mb-8">
              Experience the perfect blend of style and comfort with our {product.title}. Carefully crafted for a premium feel.
            </p>

            {/* Size Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-4">Size</h3>
              <div className="flex flex-wrap items-center gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-lg text-[16px] transition-colors ${
                      size === s
                        ? "border-black text-black font-bold"
                        : "border-gray-300 text-black hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Wishlist */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center justify-between border border-gray-300 rounded-lg w-full sm:w-[140px] h-[52px] px-4 shrink-0">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-600 hover:text-black">
                  <Minus size={20} strokeWidth={2} />
                </button>
                <span className="text-[17px] font-medium text-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-600 hover:text-black">
                  <Plus size={20} strokeWidth={2} />
                </button>
              </div>
              <button className="w-full sm:flex-1 h-[52px] bg-[#00c3ff] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide hover:bg-[#00abe0] transition-colors shadow-md">
                <Heart size={18} strokeWidth={2.5} />
                Wishlist
              </button>
            </div>

            <button className="w-full h-[52px] bg-[#00c3ff] text-white rounded-full font-bold text-[14px] uppercase tracking-wide hover:bg-[#00abe0] transition-colors shadow-md">
              Add To Cart
            </button>
            
          </div>
        </div>

      </div>
    </section>
  );
}