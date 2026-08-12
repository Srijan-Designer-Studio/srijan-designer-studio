"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { Loader2, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { submitCustomRequest } from "@/app/actions/forms";
import { allProducts } from "@/data/products";

gsap.registerPlugin(ScrollTrigger);

export default function PerfectFit() {
  const containerRef = useRef(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState({ type: '', message: '' });

  const leftImage = allProducts.filter(p => p.category.includes("Western"))[1]?.image || "";
  const rightImage = allProducts.filter(p => p.category === "Bridal")[0]?.image || "";

  useGSAP(() => {
    gsap.fromTo(
      ".pf-left-img",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".pf-top-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".pf-left-text",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power4.out", scrollTrigger: { trigger: ".pf-top-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );
    gsap.fromTo(
      ".pf-right-content",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power4.out", scrollTrigger: { trigger: ".pf-top-sec", start: "top 75%", toggleActions: "play none none reverse" } }
    );
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        await submitCustomRequest(formData);
        setStatus({ type: 'success', message: 'Request submitted! We will call you at the selected time.' });
        e.target.reset();
      } catch (error) {
        setStatus({ type: 'error', message: 'Failed to submit request. Please try again.' });
      }
    });
  };

  return (
    <div ref={containerRef}>
      <section className="pf-top-sec py-16 lg:py-24 bg-white">
  <div className="max-w-[1320px] mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
      
      <div className="flex flex-col gap-6 lg:gap-10">
        <div className="pf-left-img relative w-full aspect-square rounded-[24px] overflow-hidden bg-[#ebe8e3] shadow-sm">
          {leftImage && <Image src="/Create Custom-img/17.webp" alt="Custom Fit Example 1" fill className="object-cover object-top" />}
        </div>
        <p className="pf-left-text text-gray-700 text-[15px] sm:text-[17px] leading-[1.7] max-w-[450px]">
          Forget "small, medium, large" and everything that never quite fits. Every designer dress we make is built around your exact measurements, your comfort and your style. So, it looks natural and feels like you.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:gap-10">
        <h2 className="pf-right-content text-3xl sm:text-4xl lg:text-[42px] font-bold text-black leading-[1.2]">
          Your Body Isn't the Problem.<br className="hidden lg:block" /> Standard Sizes Are
        </h2>
        <div className="pf-right-content relative w-full aspect-square rounded-[24px] overflow-hidden bg-[#ebe8e3] shadow-sm">
          {rightImage && <Image src="/Create Custom-img/18.webp" alt="Custom Fit Example 2" fill className="object-cover object-top" />}
        </div>
      </div>

    </div>
  </div>
</section>

      <section className="pf-bottom-sec flex flex-col lg:flex-row min-h-[600px] bg-[#f8f9fa]">
        <div className="relative w-full lg:w-1/2 flex items-center p-8 lg:p-20 overflow-hidden">
          <Image src="/Create Custom-img/Untitled design (4).webp" alt="Tailoring" fill className="object-cover absolute inset-0 z-0" />
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
            
            {status.type === 'success' ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-500">
                  <CheckCircle2 size={50} className="text-[#00c3ff] mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h3>
                  <p className="text-gray-600 text-sm">{status.message}</p>
                  <button onClick={() => setStatus({ type: '', message: '' })} className="mt-6 text-[#00c3ff] text-sm font-medium hover:underline">
                      Submit another request
                  </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Full Name*</label>
                  <input name="name" required type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone Number*</label>
                  <input name="phone" required type="tel" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Call back Date*</label>
                    <input name="callDate" required type="date" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Call back Time*</label>
                    <input name="callTime" required type="time" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Additional Details</label>
                  <textarea name="details" rows="3" placeholder="Tell us about the outfit you have in mind..." className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors resize-none"></textarea>
                </div>
                
                {status.type === 'error' && <p className="text-red-500 text-xs">{status.message}</p>}

                <button disabled={isPending} type="submit" className="w-full flex justify-center items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3.5 rounded-lg transition-colors mt-2 uppercase tracking-wide shadow-md disabled:opacity-70">
                  {isPending && <Loader2 size={18} className="animate-spin" />}
                  {isPending ? "Submitting..." : "Submit Now"}
                </button>
                <p className="text-[11px] text-center text-gray-400 mt-3">Never submit passwords or credit card details here.</p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}