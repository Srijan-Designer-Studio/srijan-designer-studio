"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: "Can I customize a dress or outfit for my child?", a: "Yes, we specialize in tailoring outfits to your exact specifications." },
  { q: "Can I match my child's outfit with my own outfit?", a: "Absolutely! We offer twinning options for parents and children." },
  { q: "What age groups do you make custom kids wear for?", a: "We create custom outfits for newborns up to 14-year-olds." },
  { q: "How long does it take to complete a custom kids wear order?", a: "It typically takes 2 to 4 weeks depending on the design." },
  { q: "Can I choose the fabric for my child's outfit?", a: "Yes, we have a wide range of child-friendly, comfortable fabrics to choose from." },
  { q: "Can I make changes to the design before stitching starts?", a: "Yes, changes can be made during the final design review stage." },
  { q: "How do I provide my child's measurements?", a: "We provide a detailed measurement guide or you can book an online consultation." },
  { q: "Are custom kids outfits comfortable for everyday wear?", a: "Yes, we prioritize soft linings and breathable fabrics for ultimate comfort." },
  { q: "Do you make outfits for birthdays and special occasions?", a: "Yes, we design thematic and festive wear for all special occasions." },
  { q: "How do I place an order for custom kids wear?", a: "Fill out the contact form on this page to schedule your initial consultation." }
];

export default function KidsFAQ() {
  const [open, setOpen] = useState(null);
  const containerRef = useRef(null);

  const leftColumn = faqs.slice(0, 5);
  const rightColumn = faqs.slice(5, 10);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".kfaq-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".kfaq-item",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <h2 className="kfaq-head text-4xl md:text-[42px] font-bold text-center text-black font-serif mb-16">
          Frequently Asked Questions
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-4">
            {leftColumn.map((faq, idx) => (
              <div key={idx} className="kfaq-item bg-[#e6f4fc] rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                <button
                  onClick={() => setOpen(open === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-black font-medium text-[14px]"
                >
                  {faq.q}
                  {open === idx ? <ChevronUp size={20} className="shrink-0 ml-4 text-[#00c3ff]" /> : <ChevronDown size={20} className="shrink-0 ml-4 text-gray-500" />}
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

          <div className="space-y-4">
            {rightColumn.map((faq, idx) => {
              const rightIdx = idx + 5;
              return (
                <div key={rightIdx} className="kfaq-item bg-[#e6f4fc] rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                  <button
                    onClick={() => setOpen(open === rightIdx ? null : rightIdx)}
                    className="w-full flex items-center justify-between p-5 text-left text-black font-medium text-[14px]"
                  >
                    {faq.q}
                    {open === rightIdx ? <ChevronUp size={20} className="shrink-0 ml-4 text-[#00c3ff]" /> : <ChevronDown size={20} className="shrink-0 ml-4 text-gray-500" />}
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${open === rightIdx ? "max-h-40 opacity-100 p-5 pt-0" : "max-h-0 opacity-0 px-5"
                      }`}
                  >
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}