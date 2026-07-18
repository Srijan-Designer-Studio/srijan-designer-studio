"use client";

import { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: "Why choose a custom dress instead of a ready-made one?", a: "Custom dresses guarantee a perfect fit tailored exactly to your body measurements and style preferences." },
  { q: "How does the design process work?", a: "We start with a consultation to understand your vision, followed by fabric selection, measurements, and fittings." },
  { q: "Can I use my own design or reference image?", a: "Absolutely! We encourage you to share your ideas, sketches, or reference photos." },
  { q: "What can I customize in my dress?", a: "You can customize the fabric, color, neckline, sleeves, and fine detailing." },
  { q: "How do you ensure the dress fits perfectly?", a: "We take detailed measurements and offer necessary fittings to ensure flawless results." }
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
      <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="faq-left-anim text-3xl md:text-[40px] font-extrabold text-black mb-6 leading-tight">
            About SRIJAN Fashion<br />Custom Dresses
          </h2>
          <p className="faq-left-anim text-gray-700 leading-relaxed mb-8">
            At <strong>SRIJAN Fashion</strong>, we believe your outfit should be as unique as you are. Our designers work with your ideas, measurements and preferences to create a one-of-a-kind designer dress that fits perfectly. From choosing fabrics to adding personal details, we make the journey simple, creative and completely tailored to you.
          </p>
          <div className="faq-left-anim">
            <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md hover:-translate-y-0.5">
              Know More
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item-anim bg-[#e6f4fc] rounded-xl overflow-hidden transition-shadow hover:shadow-md">
              <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-black font-medium text-[15px]"
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