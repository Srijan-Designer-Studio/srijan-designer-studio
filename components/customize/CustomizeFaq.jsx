"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Why choose custom dresses instead of ready-made ones?",
    a: "Custom dresses are made according to your specifications for better fitting and uniqueness."
  },
  {
    q: "How does the design process work?",
    a: "First, choose your basic style, let us know what you would like and select your fabrics and our designers will make you a dress."
  },
  {
    q: "Can I use my own design or reference image?",
    a: "Yes. It is possible for you to submit drawings or photos and we will convert them into your personalized outfit."
  },
  {
    q: "What can I customize in my dress?",
    a: "Your personalized dress may have different styles, necklines, sleeves, fabrics, colors, lengths and more."
  },
  {
    q: "How do you ensure the dress fits perfectly?",
    a: "Every designer dress is made according to your measurements and designs after review of your specifications."
  }
];

export default function CustomizeFaq() {
  const [open, setOpen] = useState(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".faq-left-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    ).fromTo(
      ".faq-item-anim",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="faq-left-anim text-3xl md:text-[40px] font-extrabold text-black mb-6 leading-tight">
            Why Choose SRIJAN Fashion<br />
            for Custom Dresses
          </h2>
          <p className="faq-left-anim text-gray-700 leading-relaxed mb-8">
            Your outfit should be as one-of-a-kind
            as you are. Our designers work with
            your ideas, your measurements and
            your preferences to create a designer
            dress that actually fits. From fabric to
            final detail, we keep it simple, creative
            and completely yours.
          </p>
          <div className="faq-left-anim">
            <Link href="/customization-policy" className="bg-[#00c3ff] hover:bg-[#00abe0] cursor-pointer text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md hover:-translate-y-0.5">
              Know More
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item-anim bg-[#e6f4fc] rounded-xl overflow-hidden transition-shadow hover:shadow-md">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-black font-medium leading-relaxed font-semibold text-[15px]"
              >
                {faq.q}
                {open === idx ? <ChevronUp size={20} className="text-[#00c3ff]" /> : <ChevronDown size={20} className="text-gray-500" />}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${open === idx ? "max-h-40 opacity-100 p-5 pt-0" : "max-h-0 opacity-0 px-5"
                  }`}
              >
                <div className="text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}