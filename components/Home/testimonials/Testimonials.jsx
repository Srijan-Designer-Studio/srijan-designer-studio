"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Review data array
const reviews = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Creative director, Los Angeles",
    review: `"I stopped looking for the next miracle product and started seeing actual change in my skin. That's the difference AURAE made."`,
    imageSrc: "/images/amit.png",
    placeholderBg: "bg-[#d4a373]",
  },
  {
    id: 2,
    name: "Samantha Lee",
    role: "Fashion Blogger, New York",
    review: `"The craftsmanship is unparalleled. Every custom piece I've ordered fits like a dream and makes me feel incredibly confident."`,
    imageSrc: "/images/ananya.png",
    placeholderBg: "bg-[#9ca3af]",
  },
  {
    id: 3,
    name: "Rahul Sharma",
    role: "Entrepreneur, Mumbai",
    review: `"Finding luxury ethnic wear that balances modern trends with traditional roots was tough until I found Srijan. Absolutely brilliant."`,
    imageSrc: "/images/rahul.png",
    placeholderBg: "bg-[#64748b]",
  },
  {
    id: 4,
    name: "Priya Desai",
    role: "Architect, Delhi",
    review: `"From the initial design consultation to the final fitting, the bespoke experience was seamless and the dress is breathtaking."`,
    imageSrc: "/images/amit.png", // Reusing image as per original data
    placeholderBg: "bg-[#d4a373]",
  },
];

// Simple Star SVG Component
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#ff8c00]">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export default function Testimonials() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 1. Fade up and scale cards as they scroll into view
    const cards = gsap.utils.toArray(".test-card");
    
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 120, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // Triggers when the top of the card hits 85% of viewport
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // 2. Subtle parallax scale down of the sticky background text as you scroll deep into the section
    gsap.to(".bg-text-wrapper", {
      scale: 0.9,
      opacity: 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white pb-[20vh]">
      
      {/* STICKY BACKGROUND TEXT (Matches the reference video perfectly) */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none z-0 px-4">
        <div className="bg-text-wrapper flex flex-col items-start -mt-20 lg:-mt-10">
          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-normal text-gray-400 tracking-tighter leading-[0.9] opacity-80">
            What they
          </h2>
          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-bold text-black tracking-tighter leading-[0.9] ml-12 md:ml-32">
            are saying
          </h2>
        </div>
      </div>

      {/* SCROLLING FLOATING CARDS */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-[50vh] flex flex-col">
        {reviews.map((item, index) => {
          
          // Asymmetrical layout mapping to create the floating staggered effect
          let alignmentClass = "";
          let marginClass = "";
          
          if (index === 0) { 
            alignmentClass = "self-start"; 
            marginClass = "mt-0"; 
          } else if (index === 1) { 
            alignmentClass = "self-end"; 
            marginClass = "mt-[15vh] lg:mt-[20vh]"; 
          } else if (index === 2) { 
            alignmentClass = "self-start md:self-center"; 
            marginClass = "mt-[15vh] lg:mt-[25vh]"; 
          } else if (index === 3) { 
            alignmentClass = "self-end md:self-start"; 
            marginClass = "mt-[15vh] lg:mt-[15vh]"; 
          }

          return (
            <div
              key={item.id}
              className={`test-card w-full max-w-[360px] md:max-w-[400px] ${alignmentClass} ${marginClass} bg-white/90 backdrop-blur-md p-6 lg:p-8 rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100`}
            >
              
              {/* User Info Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                  {item.imageSrc ? (
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${item.placeholderBg} flex items-center justify-center`}>
                      <span className="text-white text-sm font-bold uppercase">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-[16px] font-bold text-black leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>

              {/* 5 Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-800 text-[15px] leading-[1.7] font-medium">
                {item.review}
              </p>
              
            </div>
          );
        })}
      </div>
      
    </section>
  );
}