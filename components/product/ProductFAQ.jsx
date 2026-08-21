"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductFAQ({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  // If there are no FAQs for this product, don't render the section
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) {
    return null; 
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-16 mb-12 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10 font-serif">
        Frequently Asked Questions
      </h2>
      
      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <div 
            key={faq.id || index} 
            className="rounded-[32px] overflow-hidden bg-[#e8f4ff] transition-all duration-300"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 text-left focus:outline-none"
            >
              <span className="text-[16px] sm:text-[17px] font-medium text-gray-900 pr-4">
                {faq.question}
              </span>
              <ChevronDown
                size={22}
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
              <div className="px-6 pb-5 sm:px-8 sm:pb-6 text-[15px] sm:text-[16px] text-gray-700 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}