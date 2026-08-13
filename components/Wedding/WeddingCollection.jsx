"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAdminProducts } from "@/app/actions/admin";

gsap.registerPlugin(ScrollTrigger);

export default function WeddingCollection() {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const tweenRef = useRef(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAdminProducts();
        if (data && data.length > 0) {
          setProducts(data.slice(0, 8));
        } else {
          setProducts([
            { id: 1, title: "Bridal Lehenga", image_url: "/Custom Wedding Wear/.webp" },
            { id: 2, title: "Wedding Saree", image_url: "/Custom Wedding Wear/.webp" },
            { id: 3, title: "Designer Gown", image_url: "/Custom Wedding Wear/.webp" },
            { id: 4, title: "Silk Saree", image_url: "/Custom Wedding Wear/.webp" },
          ]);
        }
      } catch (error) {
        setProducts([
          { id: 1, title: "Bridal Lehenga", image_url: "/images/collection1.png" },
          { id: 2, title: "Wedding Saree", image_url: "/images/collection2.png" },
          { id: 3, title: "Designer Gown", image_url: "/images/collection3.png" },
          { id: 4, title: "Silk Saree", image_url: "/images/collection1.png" },
        ]);
      }
    };
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (products.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      }
    });

    tl.fromTo(
      ".wed-coll-text",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(
      ".wed-coll-img",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.6"
    );

    tweenRef.current = gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 25,
      repeat: -1,
    });
  }, { scope: containerRef, dependencies: [products] });

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.play();

  return (
    <section className="py-20 bg-[#f4f5f8] overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="w-full lg:w-1/3">
            <h2 className="wed-coll-text text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
              Crafted for Your <br className="hidden lg:block" /> Special Day
            </h2>
            <p className="wed-coll-text text-[#333] text-[16px] leading-relaxed mb-8">
              Every wedding dress is crafted with care, comfort and timeless style.
            </p>
            <div className="wed-coll-text">
              <Link
                href="/wedding"
                className="inline-flex items-center gap-3 text-[#1070c0] font-bold text-[14px] uppercase tracking-wide transition-opacity hover:opacity-80"
              >
                SHOP OUR COLLECTION
                <ArrowRight size={22} strokeWidth={2.5} className="text-black" />
              </Link>
            </div>
          </div>

          <div 
            className="w-full lg:w-2/3 overflow-hidden relative cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div ref={marqueeRef} className="flex w-max pt-4 pb-6">
              
              <div className="flex gap-6 pr-6">
                {products.map((product, index) => (
                  <Link 
                    href={`/product/${product.id}`} 
                    key={`first-${product.id || index}`} 
                    className="wed-coll-img relative shrink-0 w-[240px] sm:w-[280px] aspect-[2/3] bg-white rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group"
                  >
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.title || "Wedding Dress"} 
                        fill 
                        unoptimized
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold uppercase text-sm">
                        No Image
                      </div>
                    )}
                  </Link>
                ))}
              </div>

              <div className="flex gap-6 pr-6">
                {products.map((product, index) => (
                  <Link 
                    href={`/product/${product.id}`} 
                    key={`second-${product.id || index}`} 
                    className="wed-coll-img relative shrink-0 w-[240px] sm:w-[280px] aspect-[2/3] bg-white rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group"
                  >
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.title || "Wedding Dress"} 
                        fill 
                        unoptimized
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold uppercase text-sm">
                        No Image
                      </div>
                    )}
                  </Link>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}