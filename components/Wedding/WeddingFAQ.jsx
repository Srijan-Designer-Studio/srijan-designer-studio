"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    q: "Can I customize my wedding dress at SRIJAN Fashion?",
    a: "Yes, we provide full customization services right from fabrics and colours to embroideries, necklines, sleeves and more. Just give us your ideas and inspirations and we'll design an outfit which suits you the most.",
  },
  {
    q: "Do you make wedding wear for different ceremonies like Haldi, Sangeet, and Reception?",
    a: "Yes, we do. Our range of designs covers all types of wedding events which include Haldi, Mehendi, Sangeet, Engagement, Reception, Pooja and the wedding itself. So get the ideal outfit according to each function.",
  },
  {
    q: "Can I bring my own design idea or reference image?",
    a: "Yes, absolutely. Share your photos, sketches or any other inspiration from your smartphone and our team will help you create a masterpiece out of it.",
  },
  {
    q: "How long does it take to create a custom wedding outfit?",
    a: "Depending upon the type of design and detailing, it varies. It is suggested to reach out to us long before the event so that there is enough time left to design and stitch the outfit.",
  },
  {
    q: "Do you take measurements for a made-to-fit outfit?",
    a: "Yes, we design outfits according to your body measurements to ensure the proper fitting. Also, if required, we also help you through the measurement process.",
  },
  {
    q: "How do I get started with my custom wedding wear?",
    a: "Just reach out to SRIJAN Fashion and let us know about your requirements. We shall discuss with you and provide you suggestions regarding the design and then create your outfit.",
  },
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
      { scale: 0.8, opacity: 0 },
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
      <div className="max-w-[1150px] mx-auto px-3">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-16 items-start">
          
          <div className="w-full md:w-1/2">
            <div className="faq-img-anim relative w-full aspect-square -mb-10 md:-mb-36 lg:-mb-30 z-20 pointer-events-none scale-105 sm:scale-110 lg:scale-[1.20] origin-top">
              {bgImageSrc && (
                <Image
                  src={bgImageSrc}
                  alt="Frequently Asked Questions"
                  fill
                  className="object-contain object-bottom"
                />
              )}
              <div className="absolute top-[6%] sm:top-[6%] left-0 right-0 text-center z-10 px-6">
                <h2 className="text-[32px] sm:text-[38px] md:text-[40px] font-bold text-white leading-[1.1] font-serif drop-shadow-md tracking-wide">
                  Frequently Asked <br /> Questions
                </h2>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4 pt-8 md:pt-12 relative z-20">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item-anim flex flex-col">
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between bg-[#e6f3fd] px-6 py-4 text-left transition-colors hover:bg-[#d6ecfb] focus:outline-none ${
                    openIndex === index ? "rounded-t-[24px]" : "rounded-[24px]"
                  }`}
                >
                  <span className="text-[14px] font-medium font-semibold text-gray-800 pr-4">{faq.q}</span>
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
                    openIndex === index ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 py-4 text-[14px] text-gray-600 bg-[#f4f9fd] rounded-b-[24px] border border-t-0 border-[#e6f3fd]">
                    {faq.a}
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