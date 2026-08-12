"use client";

import { useRef } from "react";
import Image from "next/image";
import { Scissors, PenTool, Ruler, Truck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function DesignProcess() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Section 1: Intro
    gsap.fromTo(
      ".dp-intro-text",
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".dp-intro-sec", start: "top 80%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".dp-intro-img",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".dp-intro-sec", start: "top 80%", toggleActions: "play none none reverse" } }
    );

    // Section 2: How it works steps
    gsap.fromTo(
      ".hiw-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".hiw-sec", start: "top 80%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".hiw-step",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power4.out", scrollTrigger: { trigger: ".hiw-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );

    // Section 3: Designers
    gsap.fromTo(
      ".designer-header",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".designer-sec", start: "top 85%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".designer-card",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power4.out", scrollTrigger: { trigger: ".designer-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#8b91a5] to-[#4b5563] text-white overflow-hidden">
        <div className="max-w-[1320px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

          <div className="max-w-[550px]">
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold mb-6 leading-[1.2]">
              Designing Your Dream Outfit Is Easier Than You Think
            </h2>
            <p className="text-gray-100 leading-[1.7] text-base sm:text-[17px]">
              Pick a base style. Share your ideas, inspiration or a reference picture. We take it from there refining every detail, helping you choose the perfect fabric and turning your vision into custom dresses that's ready to wear.
            </p>
          </div>

          <div className="relative w-full max-w-[700px] mx-auto lg:ml-auto">



            <Image
              src="/Create Custom-img/Laptop Image.webp"
              alt="Design Process"
              width={800}
              height={500}
              priority
              className="relative z-10 w-full h-auto pointer-events-none drop-shadow-2xl"
            />
          </div>

        </div>
      </section>

      <section className="hiw-sec py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="hiw-title text-3xl sm:text-[38px] font-bold text-black mb-16 lg:mb-20">
            How Does It Work ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8 mb-12 lg:mb-16">

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/icon 1.webp" alt="Pick your fabric" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Pick your fabric</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Choose the fabric and colour you love.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/icon 2.webp" alt="Design a dress" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Design a dress</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Share your ideas and create your perfect look.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/icon 3.webp" alt="Get measured" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Get measured</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Send your measurements for a perfect fit.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8 max-w-[850px] mx-auto">

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/icon 4.webp" alt="Consult with designer" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Consult with designer</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Discuss your vision with fashion designer.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/icon 5.webp" alt="Get delivered" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Get delivered</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Receive your custom-made dress at your doorstep.
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="designer-sec py-16 bg-gradient-to-r from-[#2c2b50] to-[#5d5b8d] text-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <h2 className="designer-header text-3xl font-bold mb-4">Dresses Designed by Real Designer</h2>
          <p className="designer-header mb-10 text-gray-300 max-w-3xl">From dream sketches to finished outfits, discover how our designers create custom dresses that match every style, occasion and personality perfectly.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="designer-card flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative w-30 h-30 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                <Image src="/Create Custom-img/Mithu Roy.webp" alt="Mithu Roy" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm mb-2 text-gray-300">Crafting unique, client-inspired designs with creativity and precision.</p>
                <h4 className="font-bold text-lg text-white">Mithu Roy,</h4>
                <p className="text-sm font-medium text-gray-300">Founder & Fashion Designer</p>
              </div>
            </div>
            <div className="designer-card flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative w-30 h-30 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                <Image src="/Create Custom-img/Joydeep Chakraborty.webp" alt="Joydeep Chakraborty" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm mb-2 text-gray-300">Bringing every custom design idea to life with care.</p>
                <h4 className="font-bold text-lg text-white">Joydeep Chakraborty,</h4>
                <p className="text-sm font-medium text-gray-300">Co. Fashion Designer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}