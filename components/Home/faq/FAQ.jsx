"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// FAQ data array containing questions from the image and placeholder answers
const faqData = [
  {
    id: 1,
    question: "Can I enjoy online shopping and order custom outfits from Srijan Fashion?",
    answer: "Yes, absolutely! We offer a seamless online shopping experience. You can browse our latest collections or request a completely custom-made outfit directly through our website.",
  },
  {
    id: 2,
    question: "Can I customize outfits for my child's birthday or special event?",
    answer: "Yes, we specialize in bespoke kids' wear. You can share your theme, occasion, and style preferences, and we will design an adorable, custom-fit outfit for your little one.",
  },
  {
    id: 3,
    question: "What fashion styles are available at Srijan Fashion?",
    answer: "We offer a diverse range of fashion styles, including traditional ethnic wear, modern western wear, Indo-western fusion, and exclusive bridal collections.",
  },
  {
    id: 4,
    question: "How does the custom dress design process work?",
    answer: "It's very simple! First, you share your design ideas and measurements with us. Our expert designers will then consult with you, select the perfect fabrics, and meticulously stitch the outfit to ensure a flawless fit.",
  },
  {
    id: 5,
    question: "Do you create custom wedding wear?",
    answer: "Yes, we do. We bring your dream wedding look to life with custom bridal and groom outfits designed around your personal style, ensuring a perfect fit for your special moments.",
  },
  {
    id: 6,
    question: "Do you offer online shopping across India?",
    answer: "Yes, we provide reliable delivery services across all major cities and towns in India, ensuring your favorite outfits reach your doorstep safely.",
  },
];

export default function FAQ() {
  
  const [openId, setOpenId] = useState(null);

 
  const toggleFAQ = (id) => {
    setOpenId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Red Subheading */}
          <span className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-3 block">
            FAQS
          </span>

          {/* Main Heading (Using serif font to match the image) */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#111] leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 lg:gap-y-6">
          {faqData.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className="bg-[#eaf4fc] rounded-xl overflow-hidden h-fit transition-colors duration-300"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex justify-between items-center text-left p-5 focus:outline-none"
                >
                  <span className="text-[15px] lg:text-[16px] text-gray-800 font-semibold pr-4">
                    {faq.question}
                  </span>
                  
                  {/* Chevron Icon with rotation animation */}
                  <ChevronDown
                    size={20}
                    strokeWidth={2.5}
                    className={`text-black flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {/* Answer Content Container (Smooth Height Animation via Grid) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm lg:text-[15px] text-gray-600 leading-relaxed">
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