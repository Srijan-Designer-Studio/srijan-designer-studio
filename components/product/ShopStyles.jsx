"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronRight, Heart } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

gsap.registerPlugin(ScrollTrigger);

export default function ShopSection({ title, viewAllLink, products = [] }) {
  const containerRef = useRef(null);
  const { wishlistItems, toggleWishlist } = useCart();
  const productsData = products.slice(0, 4);

  useGSAP(() => {
    if (productsData.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".shop-head",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    ).fromTo(
      ".shop-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.3"
    );
  }, { scope: containerRef, dependencies: [productsData] });

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

  if (productsData.length === 0) {
    return (
      <section className="py-16 bg-white border-b border-gray-200" ref={containerRef}>
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="shop-head flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#111]">{title}</h2>
          </div>
          <div className="flex justify-center items-center h-32 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-gray-500 font-medium">No products available in this section yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white border-b border-gray-200" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <div className="shop-head flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#111]">
            {title}
          </h2>

          <Link
            href={viewAllLink}
            className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {productsData.map((product) => {
            const mainImage = product.product_images?.[0]?.image_url;
            const isWishlisted = wishlistItems?.some(item => item.id === product.id);

            const basePrice = Number(product.base_price) || 0;
            const salePrice = Number(product.sale_price) || 0;
            const hasDiscount = salePrice > 0 && salePrice < basePrice;
            const displayPrice = hasDiscount ? salePrice : basePrice;

            return (
              <Link href={`/product/${product.slug}`} key={product.id}
                className="shop-card group flex flex-col items-center cursor-pointer relative"
              >
                <div className="relative w-full aspect-[2/3] rounded-[16px] border border-gray-400 overflow-hidden mb-4 bg-white transition-shadow duration-300 group-hover:shadow-xl">
                  {mainImage ? (
                    <img
                      src={mainImage}
                      alt={product.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">No Image</div>
                  )}

                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
                  >
                    <Heart 
                      size={18} 
                      className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-[#00c3ff]'}`} 
                    />
                  </button>
                </div>
                <h3 className="text-[14px] sm:text-[16px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-3">
                  {product.title}
                </h3>
                
                <div className="flex items-center justify-center gap-2">
                  <p className="text-[14px] sm:text-[15px] font-bold text-red-600 text-center">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </p>
                  {hasDiscount && (
                    <p className="text-[12px] sm:text-[13px] font-medium text-black line-through text-center">
                      ₹{basePrice.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}