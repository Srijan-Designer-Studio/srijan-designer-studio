"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MenDescription() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray(".men-desc-anim");

    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section className="py-16 lg:py-24 bg-[#f4f5f8]" ref={containerRef}>
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="text-[15px] sm:text-[16px] text-[#333] leading-[1.8]">

          <h2 className="men-desc-anim text-2xl lg:text-[28px] font-bold text-black mb-4 font-serif">
            Men's Shopping: Keep It Simple With SRIJAN Fashion
          </h2>
          <p className="men-desc-anim mb-4">
            Most men don't enjoy overthinking clothes. You just want something that fits well, feels comfortable and looks good without much effort. That's exactly what we focus on at <strong className="font-bold text-black">SRIJAN Fashion</strong>.
          </p>
          <p className="men-desc-anim mb-12">
            We create outfits for men that are easy to wear and easy to like. No confusion, no extra noise — just good, reliable men wear that works for you.
          </p>

          <h2 className="men-desc-anim text-2xl lg:text-[28px] font-bold text-black mb-4 font-serif">
            Styles That Fit Your Everyday And Special Days
          </h2>
          <p className="men-desc-anim mb-6">
            You don't need a huge wardrobe. You just need the right pieces. Our collection of men's wear is built around that idea:
          </p>
          <ul className="list-disc pl-5 mb-12 space-y-4 marker:text-black">
            <li className="men-desc-anim">
              <strong className="font-bold text-black">Western Wear for Daily Use:</strong> Clean and simple styles that you can wear anywhere. These men outfits are made for comfort and ease.
            </li>
            <li className="men-desc-anim">
              <strong className="font-bold text-black">Ethnic Wear for Celebrations:</strong> Kurtas and traditional styles that feel right for festivals and family occasions. This is men wear that keeps things classic without feeling heavy.
            </li>
            <li className="men-desc-anim">
              <strong className="font-bold text-black">Indo-Western Styles:</strong> A balanced mix of traditional and modern. Great for events where you want to stand out, but still feel relaxed.
            </li>
            <li className="men-desc-anim">
              <strong className="font-bold text-black">Custom-Made, Always:</strong> Nothing is picked off a rack. You choose how you want it. That's how we create outfits for men that actually fit your style and your body.
            </li>
          </ul>

          <h2 className="men-desc-anim text-2xl lg:text-[28px] font-bold text-black mb-4 font-serif">
            Why Go Custom?
          </h2>
          <p className="men-desc-anim mb-4">
            Because most ready-made clothes don't really fit the way you want. Something is always slightly off.
          </p>
          <p className="men-desc-anim mb-4">
            At <strong className="font-bold text-black">SRIJAN Fashion</strong>, we fix that. Every piece of men's clothing is made as per your measurements and your comfort. You get something that feels right the moment you wear it.
          </p>
          <p className="men-desc-anim mb-12">
            And the process is simple. No store visits. No hassle. Just tell us what you need and we'll take care of it. We create men outfits that are made to be worn, not adjusted.
          </p>

          <h2 className="men-desc-anim text-2xl lg:text-[28px] font-bold text-black mb-4 font-serif">
            Men's Clothes That Just Work
          </h2>
          <p className="men-desc-anim mb-4">
            From weddings to small gatherings or even daily wear, <strong className="font-bold text-black">SRIJAN Fashion</strong> creates outfits for men that feel easy and comfortable.
          </p>
          <p className="men-desc-anim">
            No extra effort. No overthinking. Just simple, well-made clothes that fit well, look good and feel right every time you wear them.
          </p>

        </div>
      </div>
    </section>
  );
}