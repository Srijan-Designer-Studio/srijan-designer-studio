"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  "Can I customize my wedding dress at SRIJAN Fashion?",
  "Do you make wedding wear for different ceremonies like Haldi, Sangeet and Reception?",
  "Can I bring my own design idea or reference image?",
  "How long does it take to create a custom wedding outfit?",
  "Do you take measurements for a made-to-fit outfit?",
  "How do I get started with my custom wedding wear?",
];

export default function WeddingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);
  const bgImageSrc = "/Custom Wedding Wear/Untitled design (4).webp";

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".faq-img-anim",
      { scale: 0.8, opacity: 0 }, // Changed starting scale slightly so the animation looks smooth with the new bigger size
      { scale: 1, opacity: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      ".faq-item-anim",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="pt-20 pb-12 sm:pb-16 bg-white relative z-10" ref={containerRef}>
      {/* Slightly increased max-width to give the larger image more breathing room */}
      <div className="max-w-[1150px] mx-auto px-3">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">

          {/* Changed width to 50% */}
          <div className="w-full md:w-1/2">
            {/* Added scale-110 lg:scale-[1.20] origin-top to significantly enlarge the image visually */}
            <div className="faq-img-anim relative w-full aspect-square -mb-10 md:-mb-36 lg:-mb-30 z-20 pointer-events-none scale-105 sm:scale-110 lg:scale-[1.20] origin-top">
              {bgImageSrc && (
                <Image
                  src={bgImageSrc}
                  alt="Frequently Asked Questions"
                  fill
                  className="object-contain object-bottom"
                />
              )}
              {/* Text Overlay */}
              <div className="absolute top-[6%] sm:top-[6%] left-0 right-0 text-center z-10 px-6">
                <h2 className="text-[32px] sm:text-[38px] md:text-[40px] font-bold text-white leading-[1.1] font-serif drop-shadow-md tracking-wide">
                  Frequently Asked <br /> Questions
                </h2>
              </div>
            </div>
          </div>

          {/* Changed width to 50% and added md:pt-12 so the FAQ aligns nicely with the scaled image */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 pt-8 md:pt-12 relative z-20">
            {faqData.map((question, index) => (
              <div key={index} className="faq-item-anim flex flex-col shadow-sm">
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between bg-[#e6f3fd] px-6 py-4 text-left transition-colors hover:bg-[#d6ecfb] ${
                    openIndex === index ? "rounded-t-[24px]" : "rounded-[24px]"
                  }`}
                >
                  <span className="text-[14px] font-medium text-gray-800 pr-4">{question}</span>
                  <ChevronDown
                    size={20}
                    strokeWidth={2.5}
                    className={`text-black shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-4 text-[14px] text-gray-600 bg-[#f4f9fd] rounded-b-[24px] border border-t-0 border-[#e6f3fd]">
                    Yes, we provide completely customized designer outfits tailored to your exact measurements and preferences.
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}