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
      <section className="dp-intro-sec py-16 bg-gradient-to-br from-[#8b91a5] to-[#4b5563] text-white">
        <div className="max-w-[1320px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="dp-intro-text text-3xl font-bold mb-6">How to Design<br />your Own Dress</h2>
            <p className="dp-intro-text text-gray-100 leading-relaxed text-sm md:text-base">
              Creating your dream outfit is simple. Start by choosing a base style, then share your design ideas, inspiration or reference images with us. We'll work with you to refine every detail, help you select the perfect fabric and turn your vision into beautifully crafted custom dresses made just for you.
            </p>
          </div>
          <div className="dp-intro-img relative w-full aspect-video rounded-xl overflow-hidden border-[6px] border-gray-900 bg-black shadow-2xl">
            <Image src="/images/laptop-design.jpg" alt="Design Process" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="hiw-sec py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="hiw-title text-3xl font-bold text-black mb-12">How Does It Work ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="hiw-step flex flex-col items-center">
              <Scissors size={40} strokeWidth={1.5} className="mb-4 text-black" />
              <h3 className="font-bold text-black mb-2">Pick your fabric</h3>
              <p className="text-sm text-gray-600">Choose the fabric and colour you love.</p>
            </div>
            <div className="hiw-step flex flex-col items-center">
              <PenTool size={40} strokeWidth={1.5} className="mb-4 text-black" />
              <h3 className="font-bold text-black mb-2">Design a dress</h3>
              <p className="text-sm text-gray-600">Share your ideas and create your perfect look.</p>
            </div>
            <div className="hiw-step flex flex-col items-center">
              <Ruler size={40} strokeWidth={1.5} className="mb-4 text-black" />
              <h3 className="font-bold text-black mb-2">Get measured</h3>
              <p className="text-sm text-gray-600">Send your measurements for a perfect fit.</p>
            </div>
            <div className="hiw-step flex flex-col items-center">
              <Truck size={40} strokeWidth={1.5} className="mb-4 text-black" />
              <h3 className="font-bold text-black mb-2">Get delivered</h3>
              <p className="text-sm text-gray-600">Receive your custom-made dress at your doorstep.</p>
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
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                <Image src="/images/mithu-roy.jpg" alt="Mithu Roy" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm mb-2 text-gray-300">Crafting unique, client-inspired designs with creativity and precision.</p>
                <h4 className="font-bold text-lg text-white">Mithu Roy,</h4>
                <p className="text-sm font-medium text-gray-300">Founder & Fashion Designer</p>
              </div>
            </div>
            <div className="designer-card flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-lg border border-white/10">
                <Image src="/images/joydeep.jpg" alt="Joydeep Chakraborty" fill className="object-cover" />
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