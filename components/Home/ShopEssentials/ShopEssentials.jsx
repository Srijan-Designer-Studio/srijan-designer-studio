"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

gsap.registerPlugin(ScrollTrigger);

const ShopEssentials = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState("WOMEN");
  const containerRef = useRef(null);
  const { wishlistItems, toggleWishlist } = useCart();

  const sortedProducts = [...products].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0; 
  });

  const getCategoryString = (product) => {
    return `${Array.isArray(product.categories) ? product.categories.join(' ') : product.categories?.name || product.categories || ''} ${product.gender || ''} ${product.department || ''}`.toLowerCase();
  };

  const womenProducts = sortedProducts
    .filter((product) => {
      const cat = getCategoryString(product);
      return cat.includes("women") || cat.includes("saree") || cat.includes("lehenga") || cat.includes("bridal");
    })
    .slice(0, 4);

  const menProducts = sortedProducts
    .filter((product) => {
      const cat = getCategoryString(product);
      return (cat.includes("men") && !cat.includes("women")) || cat.includes("kurta") || cat.includes("suit") || cat.includes("blazer");
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

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product);
    try {
      await toggleWishlistServer(product.id);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <section className="py-24 bg-[#fafafa]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-12 font-medium">
              No new arrivals found in this category yet.
            </p>
          ) : (
            currentProducts.map((product) => {
              let mainImage = "";
              if (Array.isArray(product.product_images) && product.product_images.length > 0) {
                mainImage = typeof product.product_images[0] === 'string' 
                  ? product.product_images[0] 
                  : product.product_images[0]?.image_url;
              }

              const categoryName = Array.isArray(product.categories) && product.categories.length > 0 
                ? product.categories[0] 
                : (product.categories?.name || product.gender || "Exclusive");

              const basePrice = Number(product.base_price) || 0;
              const salePrice = Number(product.sale_price) || 0;
              const hasDiscount = salePrice > 0 && salePrice < basePrice;
              const displayPrice = hasDiscount ? salePrice : basePrice;
              
              const isWishlisted = wishlistItems?.some(item => item.id === product.id);

              return (
                <Link href={`/product/${product.slug}`} key={product.id} className="product-card group flex flex-col items-center text-center cursor-pointer relative">
                  <div className="relative w-full aspect-[2/3] rounded-2xl border border-gray-200 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                    <div className="absolute top-4 left-4 z-10 bg-red-600 backdrop-blur-sm text-white text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest uppercase shadow-md">
                      NEW
                    </div>

                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
                    >
                      <Heart 
                        size={20} 
                        className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-[#00c3ff]'}`} 
                      />
                    </button>

                    {mainImage ? (
                      <img
                        src={mainImage}
                        alt={product.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">NO IMAGE</div>
                    )}
                  </div>

                  <h3 className="text-[16px] font-medium text-gray-800 leading-tight mb-2 line-clamp-2 px-2 group-hover:text-black">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-[18px] font-extrabold text-red-600">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </p>
                    {hasDiscount && (
                      <p className="text-[14px] font-medium text-black line-through">
                        ₹{basePrice.toLocaleString('en-IN')}
                      </p>
                    )}
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