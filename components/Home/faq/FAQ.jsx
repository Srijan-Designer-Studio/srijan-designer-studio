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
    question: "Can I shop online and customize outfits from SRIJAN Fashion?",
    answer: "Yes. You can indulge in online shopping for our readymade collections or simply get in touch with us to design an outfit especially made for you according to your tastes, sizes and occasions.",
  },
  {
    id: 2,
    question: "What fashion styles are available at Srijan Fashion?",
    answer: "We have a large collection of various fashion styles that include ethnic wear, Indo-western wear, party wear, casual wear and customized designs for women, men and kids.",
  },
  {
    id: 3,
    question: "Do you create custom wedding wear?",
    answer: "Yes. We have specialized designs for brides, grooms, bridesmaids and families for wedding wear.",
  },
  {
    id: 4,
    question: "Can I customize outfits for my child's birthday or special event?",
    answer: "Yes. Through our customize kids wear facility you can make outfits for birthdays, festivals and theme parties.",
  },
  {
    id: 5,
    question: "How does the custom dress design process work?",
    answer: "You just have to share your ideas, fashion styles, fabrics of your choice and even some images. We will design and create the custom dress according to your wishes and requirements.",
  },
  {
    id: 6,
    question: "Do you offer online shopping across India?",
    answer: "Yes. With our online shopping facility, customers from all across India can shop for our stylish outfits conveniently.",
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