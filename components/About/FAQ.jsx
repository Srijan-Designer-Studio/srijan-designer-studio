"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqData = [
  {
    id: 1,
    question: "What is SRIJAN Fashion known for?",
    answer: "SRIJAN Fashion is an exclusive boutique that provides designer, ready to wear outfits and customized clothes for women, men and children.",
  },
  {
    id: 2,
    question: "Do you create custom outfits?",
    answer: "Yes. The customization in our outfit designs is something we pride ourselves on; whether you need an outfit for your wedding day, a party or any festive occasion, we will make your outfit to suit you.",
  },
  {
    id: 3,
    question: "What makes SRIJAN Fashion different?",
    answer: "The uniqueness of our outfits is something we consider very important since it makes our designs stand out. In order to achieve uniqueness in our designs, we ensure that our outfits are of high quality and customized to suit the individual.",
  },
  {
    id: 4,
    question: "Do you offer outfits for special occasions?",
    answer: "Yes. We design outfits for occasions such as weddings, parties, festivals and any other special occasion. We also design outfits for the whole family to match.",
  },
  {
    id: 5,
    question: "Can I visit your boutique for a consultation?",
    answer: "Absolutely. You can come to our boutique where we will help you come up with your design and pick fabrics that will go well with you.",
  },
  {
    id: 6,
    question: "Do you provide ready-to-wear and custom clothing?",
    answer: "Yes. We provide our customers with both ready to wear outfits and customized designs depending on what suits you best.",
  },
  
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(document.body);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useGSAP(() => {
    gsap.to(".faq-animate", {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        once: true,
      }
    });
  }, { scope: containerRef });

  const toggleFAQ = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);
  };

  return (
    <section ref={containerRef} className="py-20 bg-white">
      <div className="max-w-[1350px] mx-auto px-6">
        
        <div className="faq-animate opacity-0 translate-y-8 text-center mb-12">
          <h2 className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-3 block">
            FAQS
          </h2>
          <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#111] leading-tight">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 lg:gap-y-6">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="faq-animate opacity-0 translate-y-8 bg-[#eaf4fc] rounded-xl overflow-hidden h-fit transition-colors duration-300"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center text-left p-6 focus:outline-none"
                >
                  <span className="text-[15px] lg:text-[17px] text-gray-800 font-semibold pr-4">
                    {faq.question}
                  </span>
                  
                  <ChevronDown
                    size={20}
                    strokeWidth={2.5}
                    className={`text-black flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm lg:text-[16px] text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}