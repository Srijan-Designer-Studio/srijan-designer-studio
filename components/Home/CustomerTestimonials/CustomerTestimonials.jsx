'use client';

import { useState, useEffect, useEffectEvent } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    quote: "SRIJAN made my bridal lehenga shopping stress-free. The collection was elegant and the alterations were done perfectly. I felt confident and comfortable throughout my wedding day.",
    author: "Ananya Sharma",
    avatar: "/images/ananya.png" 
  },
  {
    id: 2,
    quote: "I chose SRIJAN for my wedding sherwani and the experience was excellent. The fabric quality, fitting, and detailing were exactly what I wanted. The team guided me patiently and the final look exceeded my expectations.",
    author: "Rahul Mehta",
    avatar: "/images/rahul.png"
  },
  {
    id: 3,
    quote: "What I loved about SRIJAN is their attention to detail. Even though I picked a readymade outfit, it felt custom-stitched after alterations. Great quality and professional service.",
    author: "Neha Kapoor",
    avatar: "/images/neha.png"
  }
];

export default function CustomerTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const onNext = useEffectEvent(handleNext);

  
  useEffect(() => {
    const interval = setInterval(() => {
      onNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="bg-white py-16 px-4 overflow-hidden select-none">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-xs md:text-sm tracking-[0.25em] font-medium text-gray-800 uppercase mb-12">
          What Our Customers Say
        </h2>

        {/* Slider Container */}
        <div className="relative flex items-center justify-between min-h-[220px]">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="text-gray-400 hover:text-gray-800 text-3xl px-3 z-10 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            &#10094;
          </button>

          {/* Testimonial Content with Framer Motion Sliding */}
          <div className="flex-1 mx-4 md:mx-14 max-w-2xl relative h-full flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 150 }} 
                animate={{ opacity: 1, x: 0 }}  
                exit={{ opacity: 0, x: -150 }}   
                transition={{ type: "spring", stiffness: 100, damping: 18 }} 
                className="w-full flex flex-col items-center"
              >
                <p className="text-gray-500 italic leading-relaxed text-sm md:text-[15px] mb-8 font-normal max-w-xl">
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </p>

                {/* Author Profile */}
                <div className="flex items-center justify-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={testimonials[currentIndex].avatar}
                      alt={testimonials[currentIndex].author}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-500 tracking-wide">
                    {testimonials[currentIndex].author}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-gray-800 text-3xl px-3 z-10 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
}