"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".hiw-text-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(
      ".hiw-step-anim",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-gradient-to-b from-[#f8f9fa] to-[#e4e5ee]" ref={containerRef}>
      <div className="max-w-[1000px] mx-auto px-6 text-center">

        <h2 className="hiw-text-anim text-3xl font-bold text-black mb-8">
          From Vision to Vow
        </h2>

        <h3 className="hiw-text-anim text-[16px] font-bold text-black uppercase mb-4">
          DESIGN STUDIO
        </h3>

        <p className="hiw-text-anim text-[14px] sm:text-[15px] text-[#333] mb-12 leading-relaxed max-w-4xl mx-auto">
          There's no shortage of wedding dresses out there. What's rare is one that actually feels like you. Share your ideas, your inspiration, your must-haves and we'll turn them into wedding wear built entirely around your story.
        </p>

        <h3 className="hiw-text-anim text-xl font-bold text-black mb-4">
          Studio Process
        </h3>

        <p className="hiw-text-anim text-[14px] sm:text-[15px] text-[#333] mb-16 leading-relaxed max-w-4xl mx-auto">
          No confusion, no last-minute panic. Just a clear, honest process from the first conversation to the final fitting, with every detail built around you, so your wedding wear feels exactly right when it counts.
        </p>

        <div className="max-w-[700px] mx-auto text-left space-y-8">

          <div className="hiw-step-anim flex items-start gap-6">
            <span className="text-[55px] font-black text-black leading-[0.8] ">1</span>
            <div>
              <h4 className="text-[16px] font-bold text-black mb-1">Share Your Style</h4>
              <p className="text-[19px] text-[#444]">Tell us about your vision or show us your inspiration.</p>
            </div>
          </div>

          <div className="hiw-step-anim flex items-start gap-6">
            <span className="text-[55px] font-black text-black  leading-[0.8] ">2</span>
            <div>
              <h4 className="text-[16px] font-bold text-black mb-1">Review the Design</h4>
              <p className="text-[19px] text-[#444]">We'll create a design and fine-tune it with your feedback.</p>
            </div>
          </div>

          <div className="hiw-step-anim flex items-start gap-6">
            <span className="text-[55px] font-black text-black leading-[0.8] ">3</span>
            <div>
              <h4 className="text-[16px] font-bold text-black mb-1">Finalize the Details</h4>
              <p className="text-[19px] text-[#444]">Choose the fabric, colours, embroidery and finishing touches.</p>
            </div>
          </div>

          <div className="hiw-step-anim flex items-start gap-6">
            <span className="text-[55px] font-black text-black leading-[0.8] ">4</span>
            <div>
              <h4 className="text-[16px] font-bold text-black mb-1">Receive Your Outfit</h4>
              <p className="text-[19px] text-[#444]">Your custom wedding dress is carefully crafted and prepared for your celebration.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}