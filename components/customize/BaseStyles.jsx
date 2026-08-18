"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function BaseStyles() {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const tweenRef = useRef(null);

  const customProduct = allProducts.find(p => p.category.includes("Ethnic"));
  const gownProduct = allProducts.find(p => p.slug?.includes("gown")) || allProducts[0];
  const plusSizeProduct = allProducts.find(p => p.category.includes("Western"));
  const petiteProduct = allProducts.find(p => p.category === "Bridal");

  const styles = [
    { id: 1, title: "Custom Styles", image: "/Create Custom-img/Card 1.webp", link: customProduct ? `/product/${customProduct.id}` : "/product" },
    { id: 2, title: "Gown & Evening Styles", image: "/Create Custom-img/Card 2.webp", link: gownProduct ? `/product/${gownProduct.id}` : "/product" },
    { id: 3, title: "Plus Size Styles", image: "/Create Custom-img/Card 3.webp", link: plusSizeProduct ? `/product/${plusSizeProduct.id}` : "/product" },
    { id: 4, title: "Petite Styles", image: "/Create Custom-img/Card 4.webp", link: petiteProduct ? `/product/${petiteProduct.id}` : "/product" },
    { id: 5, title: "Kids Wear", image: "/Create Custom-img/Card 5.webp", link: petiteProduct ? `/product/${petiteProduct.id}` : "/product" },
    { id: 6, title: "Wedding Styles", image: "/Create Custom-img/Card 6.webp", link: petiteProduct ? `/product/${petiteProduct.id}` : "/product" },
    { id: 7, title: "Indian Wear", image: "/Create Custom-img/Card 7.webp", link: petiteProduct ? `/product/${petiteProduct.id}` : "/product" },
    { id: 8, title: "Men's Wear", image: "/Create Custom-img/Card 8.webp", link: petiteProduct ? `/product/${petiteProduct.id}` : "/product" }
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".base-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".base-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
      "-=0.4"
    ).fromTo(
      ".base-btn",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    );

    const marqueeTl = gsap.timeline({ repeat: -1 });
    const totalCards = styles.length;
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
    <section className="py-16 bg-white overflow-hidden" ref={containerRef}>

      <div className="max-w-[1320px] mx-auto text-center px-6">
        <h2 className="base-title text-3xl font-bold text-black mb-10">Start With a Base Style</h2>
      </div>

      <div 
        className="relative w-full overflow-hidden mb-10" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        <div ref={marqueeRef} className="flex w-max py-4">
          
          <div className="flex gap-6 pr-6 pl-4 sm:pl-6">
            {styles.map((style, index) => (
              <Link
                href={style.link}
                key={`first-${style.id}-${index}`}
                className="base-card w-[220px] sm:w-[260px] md:w-[280px] shrink-0 flex flex-col items-center group cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200 transition-shadow group-hover:shadow-lg">
                  {style.image && (
                    <Image
                      src={style.image}
                      alt={style.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-[#00c3ff] transition-colors">
                  {style.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="flex gap-6 pr-6">
            {styles.map((style, index) => (
              <Link
                href={style.link}
                key={`second-${style.id}-${index}`}
                className="base-card w-[220px] sm:w-[260px] md:w-[280px] shrink-0 flex flex-col items-center group cursor-pointer"
              >
                <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-gray-200 transition-shadow group-hover:shadow-lg">
                  {style.image && (
                    <Image
                      src={style.image}
                      alt={style.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="text-sm md:text-base font-medium text-gray-800 group-hover:text-[#00c3ff] transition-colors">
                  {style.title}
                </h3>
              </Link>
            ))}
          </div>

        </div>
      </div>

      <div className="max-w-[1320px] mx-auto text-center px-6">
        <div className="base-btn">
          <Link href="/shop-style">
            <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md hover:-translate-y-1 transition-transform">
              Choose Your Style
            </button>
          </Link>
        </div>
      </div>
      
    </section>
  );
}