"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Heart, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

gsap.registerPlugin(ScrollTrigger);

const ShopEssentials = ({ products = [] }) => {
  const [activeTab, setActiveTab] = useState("WOMEN");
  const containerRef = useRef(null);
  const { wishlistItems, toggleWishlist } = useCart();

  // Sort products by newest first
  const sortedProducts = [...products].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return 0;
  });

  const getCategoryString = (product) => {
    return `${Array.isArray(product.categories) ? product.categories.join(' ') : product.categories?.name || product.categories || ''} ${product.gender || ''} ${product.department || ''}`.toLowerCase();
  };

  // Women Products
  const womenProducts = sortedProducts
    .filter((product) => {
      const cat = getCategoryString(product);
      const isWomen = cat.includes("women") || cat.includes("saree") || cat.includes("lehenga") || cat.includes("bridal");
      return isWomen && product.show_on_homepage === true;
    })
    .slice(0, 8); 

  // Men Products
  const menProducts = sortedProducts
    .filter((product) => {
      const cat = getCategoryString(product);
      const isMen = (cat.includes("men") && !cat.includes("women")) || cat.includes("kurta") || cat.includes("suit") || cat.includes("blazer");
      return isMen && product.show_on_homepage === true;
    })
    .slice(0, 8); 

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
    if (currentProducts.length === 0) return;
    gsap.fromTo(
      ".product-card-wrap",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, { dependencies: [activeTab, currentProducts], scope: containerRef });

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
      <div className="max-w-[1320px] mx-auto px-6 relative">
        
        {/* Heading Section */}
        <div className="text-center mb-8">
          <div className="overflow-hidden mb-6">
            <h2 className="essentials-title text-[32px] md:text-[42px] lg:text-[48px] font-black text-[#0d123b] uppercase tracking-tight">
              SHOP WHAT’S TRENDING
            </h2>
          </div>

          {/* Tabs & View All Line Perfectly Aligned */}
          <div className="essentials-tabs flex items-center justify-between w-full relative">
            <div className="w-28 hidden md:block"></div>
            
            <div className="flex items-center gap-8 mx-auto">
              <button
                onClick={() => setActiveTab("WOMEN")}
                className={`relative text-sm md:text-[15px] font-bold tracking-widest uppercase transition-colors duration-300 pb-2 ${activeTab === "WOMEN" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
              >
                Women
                {activeTab === "WOMEN" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("MEN")}
                className={`relative text-sm md:text-[15px] font-bold tracking-widest uppercase transition-colors duration-300 pb-2 ${activeTab === "MEN" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
              >
                Men
                {activeTab === "MEN" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black rounded-full" />
                )}
              </button>
            </div>

            <Link href="/shop-style" className="hidden md:flex items-center gap-1.5 text-[13px] font-bold text-gray-700 hover:text-[#00c3ff] transition-colors uppercase tracking-wider group w-28 justify-end">
              VIEW ALL
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Slider Section */}
        <div className="w-full relative mt-16 md:mt-24">
          {currentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-center text-gray-500 font-medium mb-4 text-lg">
                No products have been added to the homepage for this category yet.
              </p>
            </div>
          ) : (
            <Swiper
              modules={[Scrollbar]}
              spaceBetween={20}
              slidesPerView={1}
              scrollbar={{
                hide: false,
                draggable: true,
              }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 24 },
                1024: { slidesPerView: 4, spaceBetween: 28 },
              }}
              className="w-full trending-swiper"
            >
              {currentProducts.map((product) => {
                let mainImage = "";
                if (Array.isArray(product.product_images) && product.product_images.length > 0) {
                  mainImage = typeof product.product_images[0] === 'string'
                    ? product.product_images[0]
                    : product.product_images[0]?.image_url;
                }

                const basePrice = Number(product.base_price) || 0;
                const salePrice = Number(product.sale_price) || 0;
                const hasDiscount = salePrice > 0 && salePrice < basePrice;
                const displayPrice = hasDiscount ? salePrice : basePrice;

                const isWishlisted = wishlistItems?.some(item => item.id === product.id);

                return (
                  <SwiperSlide key={product.id}>
                    <div className="product-card-wrap group flex flex-col items-center text-center relative h-full">
                      {/* Image Container */}
                      <Link href={`/product/${product.slug}`} className="relative w-full aspect-[2/3] rounded-[1.5rem] border border-gray-400 overflow-hidden mb-5 bg-white transition-all duration-300 group-hover:border-black block cursor-pointer">
                        
                        {/* TRENDING Tag */}
                        <div className="absolute top-4 left-4 z-10 bg-[#e50000] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full tracking-widest uppercase">
                          TRENDING
                        </div>

                        {/* Heart Button */}
                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer border border-gray-100"
                        >
                          <Heart
                            className={`w-[22px] h-[22px] transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-gray-600'}`}
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
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-50">NO IMAGE</div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <Link href={`/product/${product.slug}`} className="flex flex-col items-center justify-center w-full px-2 cursor-pointer">
                        <h3 className="text-[14px] font-medium text-gray-600 leading-snug mb-2.5 line-clamp-2 hover:text-black transition-colors">
                          {product.title}
                        </h3>

                        <div className="flex items-center justify-center gap-2">
                          <p className="text-[17px] font-black text-[#0d123b]">
                            ₹{displayPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/shop-style" className="flex items-center justify-center w-full max-w-[280px] gap-2 text-[14px] font-bold text-white bg-black hover:bg-gray-800 px-6 py-3.5 rounded-full transition-colors uppercase tracking-wider">
            View All Products
          </Link>
        </div>
      </div>

      {/* FORCEFUL Custom Scrollbar CSS */}
      <style jsx global>{`
        /* Add explicit padding to the swiper container so there is room for the scrollbar */
        .trending-swiper {
          padding-bottom: 60px !important;
        }
        .trending-swiper .swiper-scrollbar {
          background: #e5e7eb; 
          height: 6px;
          border-radius: 10px;
          /* Position scrollbar explicitly within the padded area */
          bottom: 15px !important; 
          width: 100%;
          left: 0;
        }
        .trending-swiper .swiper-scrollbar-drag {
          background: #00c3ff;
          border-radius: 10px;
          cursor: pointer;
        }
        .trending-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}

export default ShopEssentials;