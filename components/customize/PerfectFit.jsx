"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function PerfectFit() {
  const containerRef = useRef(null);
  const leftImage = allProducts.filter(p => p.category.includes("Western"))[1]?.image || "";
  const rightImage = allProducts.filter(p => p.category === "Bridal")[0]?.image || "";

  useGSAP(() => {
    // Top Section
    gsap.fromTo(
      ".pf-left-img",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".pf-top-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".pf-right-content",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", scrollTrigger: { trigger: ".pf-top-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );

    // Form Section
    gsap.fromTo(
      ".pf-banner-text",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".pf-bottom-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".pf-form-card",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: ".pf-bottom-sec", start: "top 80%", toggleActions: "play none none reverse" } }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <section className="pf-top-sec py-16 bg-white">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4">
              <div className="pf-left-img relative w-full sm:w-1/2 aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-200">
                {leftImage && <Image src={leftImage} alt="Custom Fit Example 1" fill className="object-cover" />}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="pf-right-content text-3xl font-bold text-black mb-6 text-right">Your body isn't the problem</h2>
              <div className="pf-right-content relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 mb-6 shadow-md border border-gray-200">
                {rightImage && <Image src={rightImage} alt="Custom Fit Example 2" fill className="object-cover object-top" />}
              </div>
              <p className="pf-right-content text-gray-600 text-sm md:text-base leading-relaxed text-right">
                Forget standard sizes that never feel quite right. We create every designer dress around your measurements, style and comfort. The result is a custom fit that looks natural, feels confident and is made just for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pf-bottom-sec flex flex-col lg:flex-row min-h-[600px] bg-[#f8f9fa]">
        <div className="relative w-full lg:w-1/2 flex items-center p-8 lg:p-20 overflow-hidden">
          <Image src="/images/tailoring.jpg" alt="Tailoring" fill className="object-cover absolute inset-0 z-0" />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="relative z-20 text-white max-w-lg">
            <h2 className="pf-banner-text text-4xl md:text-5xl font-bold mb-6 leading-tight">Perfect Fit<br />Guaranteed</h2>
            <p className="pf-banner-text text-base md:text-lg leading-relaxed">
              No two people are the same and your dress shouldn't be either. We tailor every design to your exact measurements, so it fits comfortably and flatters your shape. From the first stitch to the final finish, your designer dress is made just for you.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-16">
          <div className="pf-form-card w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-black mb-6">Fill In the Form To Get Started</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name*</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select date for call back*</label>
                <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Select time for call back*</label>
                <input type="time" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Message</label>
                <textarea rows="3" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors resize-none"></textarea>
              </div>
              <button type="button" className="w-full bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3.5 rounded-lg transition-colors mt-2 uppercase tracking-wide shadow-md">
                Submit Now
              </button>
              <p className="text-[11px] text-center text-gray-400 mt-3">Your profile name will be shared. Never submit passwords.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}