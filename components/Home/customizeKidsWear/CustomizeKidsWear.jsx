"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const kidsCards = [
  {
    id: 0,
    step: "Step 1",
    title: "Ocassion & Theme",
    desc: "Tell us about the occasion and your preferred theme. We'll design an outfit that brings your vision to life.",
    img: "/images/kids.png", 
    bgColor: "bg-white",
    titleColor: "text-black",
    descColor: "text-gray-800"
  },
  {
    id: 1,
    step: "Step 2",
    title: "Design & Fabric",
    desc: "We select premium, child-friendly fabrics and tailor the design for maximum comfort and elegance.",
    img: "/images/kids.png", 
    bgColor: "bg-[#fbcfe8]",
    titleColor: "text-[#831843]",
    descColor: "text-[#9d174d]"
  },
  {
    id: 2,
    step: "Step 3",
    title: "The Perfect Fit",
    desc: "Your bespoke kids wear is ready! Watch them light up the room with a custom dress made just for them.",
    img: "/images/kids.png", 
    bgColor: "bg-[#f472b6]",
    titleColor: "text-white",
    descColor: "text-pink-100"
  }
];

const marqueeWords = [
  "BESPOKE FASHION",
  "TIMELESS ELEGANCE",
  "DESIGNER COLLECTION",
  "BRIDAL SPECIALISTS",
  "CUSTOM-FIT"
];

export default function CustomizeKidsWear() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.set(".kid-card", {
      y: (i) => i * 15,
      x: (i) => i * 15,
      scale: (i) => 1 - (i * 0.04),
      zIndex: (i) => 30 - i
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top", 
        end: "+=2000", 
        scrub: 1, 
        pin: true,
        anticipatePin: 1
      }
    });

    tl.to(".card-0", { yPercent: -120, opacity: 0.5, rotate: -5, duration: 1, ease: "power2.inOut" }, "step1")
      .to(".card-1", { y: 0, x: 0, scale: 1, duration: 1, ease: "power2.inOut" }, "step1")
      .to(".card-2", { y: 15, x: 15, scale: 0.96, duration: 1, ease: "power2.inOut" }, "step1")
      .set(".card-0", { zIndex: 10 }) 
      .to(".card-0", { yPercent: 0, y: 30, x: 30, scale: 0.92, opacity: 1, rotate: 0, duration: 0.5, ease: "power2.inOut" })
      .to(".card-1", { yPercent: -120, opacity: 0.5, rotate: 5, duration: 1, ease: "power2.inOut" }, "step2")
      .to(".card-2", { y: 0, x: 0, scale: 1, duration: 1, ease: "power2.inOut" }, "step2")
      .to(".card-0", { y: 15, x: 15, scale: 0.96, duration: 1, ease: "power2.inOut" }, "step2")
      .set(".card-1", { zIndex: 10 }) 
      .to(".card-1", { yPercent: 0, y: 30, x: 30, scale: 0.92, opacity: 1, rotate: 0, duration: 0.5, ease: "power2.inOut" });

  }, { scope: containerRef });

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#41425e] via-[#757791] to-[#babbd1] pt-20 lg:pt-28 overflow-hidden flex flex-col justify-between min-h-screen" ref={containerRef}>
      
      <div className="max-w-[1320px] mx-auto px-6 w-full mb-20 lg:mb-28 h-full flex flex-col justify-center flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center h-full">
          
          <div className="max-w-[500px]">
            <span className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              CUSTOMIZE KIDS WEAR
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.3] mb-6">
              Make Every Celebration Extra Special
            </h2>
            <p className="text-gray-100 text-base sm:text-[17px] leading-[1.6] mb-8">
              Create adorable custom outfits for birthdays, family events and special 
              occasions, designed to match your theme and your little one's personality.
            </p>
            <div>
              <Link
                href="/kids"
                className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Design Now
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-[400px] mx-auto lg:ml-auto aspect-[3/4] lg:aspect-[4/5] mt-10 lg:mt-0">
            {kidsCards.map((card) => (
              <div 
                key={card.id} 
                className={`kid-card card-${card.id} absolute top-0 left-0 w-full h-full rounded-[24px] overflow-hidden shadow-2xl flex flex-col ${card.bgColor}`}
              >
                <div className="relative w-full h-[65%]">
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-[13px] sm:text-sm font-bold px-4 py-1.5 rounded-md shadow-md">
                    {card.step}
                  </div>
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover object-center"
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-start">
                  <h3 className={`text-[20px] font-bold mb-2.5 ${card.titleColor}`}>
                    {card.title}
                  </h3>
                  <p className={`text-[15px] leading-relaxed ${card.descColor}`}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="w-full bg-[#00c3ff] py-3.5 border-t border-white/20 overflow-hidden relative flex items-center shrink-0">
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: flex;
              width: max-content;
              animation: marquee 25s linear infinite;
            }
          `}
        </style>
        <div className="animate-marquee">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              {marqueeWords.map((word, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-white font-bold tracking-widest text-sm sm:text-base whitespace-nowrap">
                    {word}
                  </span>
                  <span className="text-white text-sm sm:text-base mx-6 sm:mx-10">✿</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}