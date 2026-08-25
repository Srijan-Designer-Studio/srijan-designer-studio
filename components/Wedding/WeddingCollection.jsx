"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WeddingCollection() {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const tweenRef = useRef(null);

  
  const products = [
    { id: 1, title: "Bridal Lehenga", image_url: "/Custom Wedding Wear/Products Image.webp" },
    { id: 2, title: "Wedding Saree", image_url: "/Custom Wedding Wear/Products Image 1.webp" },
    { id: 3, title: "Designer Gown", image_url: "/Custom Wedding Wear/Products Image 2.webp" },
    { id: 4, title: "Silk Saree", image_url: "/Custom Wedding Wear/Products Image 3.webp" },
    { id: 5, title: "Bridal Lehenga", image_url: "/Custom Wedding Wear/Products Image.webp" },
    { id: 6, title: "Wedding Saree", image_url: "/Custom Wedding Wear/Products Image 1.webp" },
    { id: 7, title: "Designer Gown", image_url: "/Custom Wedding Wear/Products Image 2.webp" },
    { id: 8, title: "Silk Saree", image_url: "/Custom Wedding Wear/Products Image 3.webp" },
  ];

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

    const marqueeTl = gsap.timeline({ repeat: -1 });
    const totalCards = products.length;
    const stepPercentage = 50 / totalCards; 

    for (let i = 1; i <= totalCards; i++) {
      marqueeTl.to(marqueeRef.current, {
        xPercent: -(stepPercentage * i),
        duration: 0.8,
        ease: "power2.inOut"
      }, "+=2");
    }
    
    tweenRef.current = marqueeTl;

  }, { scope: containerRef });

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.play();

  return (
    <section className="py-20 bg-[#f4f5f8] overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <div className="w-full lg:w-1/3 ">
            <h2 className="wed-coll-text text-3xl  sm:text-4xl font-bold text-black mb-6 leading-tight">
              Crafted for Your <br className="hidden lg:block" />   Special Day
            </h2>
            <p className="wed-coll-text text-[#333] text-[19px] leading-relaxed mb-8">
              Every wedding dress is crafted with care, comfort and timeless style.
            </p>
            <div className="wed-coll-text">
              <Link
                href="/shop-wedding-wear"
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
                  <div 
                    key={`first-${product.id || index}`} 
                    className="wed-coll-img relative shrink-0 w-[240px] sm:w-[280px] aspect-[2/3] bg-white rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group"
                  >
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.title} 
                        fill 
                        unoptimized
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold uppercase text-sm text-center px-4">
                        {product.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-6 pr-6">
                {products.map((product, index) => (
                  <div 
                    key={`second-${product.id || index}`} 
                    className="wed-coll-img relative shrink-0 w-[240px] sm:w-[280px] aspect-[2/3] bg-white rounded-[20px] overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group"
                  >
                    {product.image_url ? (
                      <Image 
                        src={product.image_url} 
                        alt={product.title} 
                        fill 
                        unoptimized
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold uppercase text-sm text-center px-4">
                        {product.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}