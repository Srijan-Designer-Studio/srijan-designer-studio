"use client";

import { useRef } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollToTop from "@/components/providers/ScrollToTop";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

gsap.registerPlugin(ScrollTrigger);

export default function NewArrivalsGrid({ products }) {
  const containerRef = useRef(null);
  const { wishlistItems, toggleWishlist } = useCart();

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

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleWishlist(product);
    try {
      await toggleWishlistServer(product.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6" ref={containerRef}>
      <ScrollToTop />

      <h1 className="title-anim text-3xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide">
        Shop New Arrivals
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.length > 0 ? (
          products.map((product) => {
            const imageUrl = product.product_images?.[0]?.image_url;
            const isWishlisted = wishlistItems?.some(item => item.id === product.id);

            return (
              <Link
                href={`/product/${product.slug || product.id}`}
                key={product.id}
                className="product-card-anim group flex flex-col items-center cursor-pointer relative"
              >
                <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                  
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-[10px] py-[5px] rounded-xl z-10 tracking-wider shadow-sm">
                    NEW
                  </div>

                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
                  >
                    <Heart 
                      size={18} 
                      className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-[#00c3ff]'}`} 
                    />
                  </button>

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

                <p className="text-[19px] font-bold text-black text-center">
                  ₹{product.base_price?.toLocaleString('en-IN')}
                </p>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No new arrivals found right now.
          </div>
        )}
      </div>
    </div>
  );
}