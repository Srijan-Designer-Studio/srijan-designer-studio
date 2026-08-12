"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  "Can I customize my wedding dress at Srijan Fashion?",
  "Do you make wedding wear for different ceremonies like Haldi, Sangeet and Reception?",
  "Can I bring my own design idea or reference image?",
  "How long does it take to create a custom wedding outfit?",
  "Do you take measurements for a made-to-fit outfit?",
  "How do I get started with my custom wedding wear?",
];

export default function WeddingFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);
  const bgImageSrc = "/images/bidalinquery.png";

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
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      ".faq-item-anim",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-start">

          <div className="w-full md:w-[45%]">
            <div className="faq-img-anim relative w-full aspect-square md:aspect-[4/5] rounded-[24px] bg-[#898a9d] overflow-hidden shadow-lg">
              {bgImageSrc && (
                <Image
                  src={bgImageSrc}
                  alt="Frequently Asked Questions"
                  fill
                  className="object-cover object-bottom"
                />
              )}
              <div className="absolute top-8 left-0 right-0 text-center z-10 px-6">
                <h3 className="text-2xl sm:text-4xl font-bold text-white leading-tight font-serif drop-shadow-md">
                  Frequently Asked <br /> Questions
                </h3>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[55%] flex flex-col gap-4 pt-4">
            {faqData.map((question, index) => (
              <div key={index} className="faq-item-anim flex flex-col">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between bg-[#e6f3fd] p-4 rounded-lg text-left transition-colors hover:bg-[#d6ecfb]"
                >
                  <span className="text-[14px] text-gray-800 pr-4">{question}</span>
                  <ChevronDown
                    size={20}
                    className={`text-black shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                  <div className="px-4 py-3 text-[14px] text-gray-600 bg-gray-50 rounded-b-lg border border-t-0 border-gray-100">
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