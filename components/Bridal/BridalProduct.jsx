"use client";

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

const BridalProduct = () => {
  const containerRef = useRef(null);

  const bridalProducts = allProducts.filter(
    (product) => product.category === "Bridal"
  );

  useGSAP(() => {
    gsap.fromTo(
      ".bridal-card",
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans" ref={containerRef}>
      <section className="bg-[#fcf8f6] py-16 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          {bridalProducts.map((product) => (
            <div key={product.id} className="bridal-card flex flex-col items-center text-center bg-white border border-gray-100/60 p-6 rounded-sm shadow-sm hover:shadow-md transition-all duration-300">

              <Link href={`/product/${product.id}`} className="relative w-full h-[380px] block bg-white overflow-hidden group">
                <Image src={product.image} alt={product.title} fill className="object-contain p-2 object-center group-hover:scale-[1.01] transition-transform duration-500" />
              </Link>

              <span className="text-[11px] text-gray-400 mt-6 tracking-widest uppercase">{product.category}</span>

              <Link href={`/product/${product.id}`} className="mt-2 block max-w-[280px]">
                <h3 className="text-gray-800 font-normal text-xs md:text-sm leading-snug line-clamp-2 hover:text-[#1e73be] transition-colors">{product.title}</h3>
              </Link>

              <span className="text-gray-900 font-bold text-sm mt-2 block">₹{product.price}</span>

              <Link href={`/product/${product.id}`} className="mt-4 w-full max-w-[150px]">
                <button className="w-full bg-[#1e73be] hover:bg-[#165994] text-white text-xs font-semibold uppercase py-2.5 rounded-sm transition-colors shadow-sm tracking-wider">Buy Now</button>
              </Link>

            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default BridalProduct;