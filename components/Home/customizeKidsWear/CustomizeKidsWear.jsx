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
    title: "Occasion & Theme",
    desc: "Tell us about the occasion and your preferred theme. We'll design an outfit that brings your vision to life.",
    img: "/Home_img/Card 1.webp", 
    bgColor: "bg-white",
    titleColor: "text-black",
    descColor: "text-gray-600"
  },
  {
    id: 1,
    step: "Step 2",
    title: "Design & Fabric",
    desc: "We select premium, child-friendly fabrics and tailor the design for maximum comfort and elegance.",
    img: "/Home_img/Card 2.webp", 
    bgColor: "bg-[#fbcfe8]",
    titleColor: "text-[#831843]",
    descColor: "text-[#9d174d]"
  },
  {
    id: 2,
    step: "Step 3",
    title: "The Perfect Fit",
    desc: "Your bespoke kids wear is ready! Watch them light up the room with a custom dress made just for them.",
    img: "/Home_img/Card 3.webp", 
    bgColor: "bg-[#f472b6]",
    titleColor: "text-white",
    descColor: "text-pink-100"
  }
];

export default function CustomizeKidsWear() {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      gsap.set(".desk-card", {
        y: (i) => i * 15,
        x: (i) => i * 15,
        scale: (i) => 1 - (i * 0.05),
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

      tl.to(".desk-card-0", { yPercent: -120, opacity: 0.5, rotate: -5, duration: 1, ease: "power2.inOut" }, "step1")
        .to(".desk-card-1", { y: 0, x: 0, scale: 1, duration: 1, ease: "power2.inOut" }, "step1")
        .to(".desk-card-2", { y: 15, x: 15, scale: 0.95, duration: 1, ease: "power2.inOut" }, "step1")
        .set(".desk-card-0", { zIndex: 10 }) 
        .to(".desk-card-0", { yPercent: 0, y: 30, x: 30, scale: 0.9, opacity: 1, rotate: 0, duration: 0.5, ease: "power2.inOut" })
        .to(".desk-card-1", { yPercent: -120, opacity: 0.5, rotate: 5, duration: 1, ease: "power2.inOut" }, "step2")
        .to(".desk-card-2", { y: 0, x: 0, scale: 1, duration: 1, ease: "power2.inOut" }, "step2")
        .to(".desk-card-0", { y: 15, x: 15, scale: 0.95, duration: 1, ease: "power2.inOut" }, "step2")
        .set(".desk-card-1", { zIndex: 10 }) 
        .to(".desk-card-1", { yPercent: 0, y: 30, x: 30, scale: 0.9, opacity: 1, rotate: 0, duration: 0.5, ease: "power2.inOut" });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#41425e] via-[#757791] to-[#babbd1] pt-16 lg:pt-28 overflow-hidden flex flex-col lg:min-h-screen" ref={containerRef}>
      
      <div className="max-w-[1320px] mx-auto px-6 w-full pb-10 lg:pb-28 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          
          <div className="max-w-[500px]">
            <h2 className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              CUSTOMIZE KIDS WEAR
            </h2>
            <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white leading-[1.3] mb-6">
              Make Every Celebration Extra Special
            </h3>
            <p className="text-gray-100 text-base sm:text-[17px] leading-[1.6] mb-8">
              Create adorable custom outfits for birthdays, family events and special 
              occasions, designed to match your theme and your little one's personality.
            </p>
            <div>
              <Link
                href="/create-custom-kids-wear"
                className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Design Now
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative w-full max-w-[420px] mx-auto lg:ml-auto aspect-[4/5]">
            {kidsCards.map((card) => (
              <div 
                key={card.id} 
                className={`desk-card desk-card-${card.id} absolute top-0 left-0 w-full h-full rounded-[24px] overflow-hidden shadow-2xl flex flex-col ${card.bgColor}`}
              >
                <div className="relative w-full h-[70%] bg-gray-200 shrink-0">
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-4 py-1.5 rounded-md">
                    {card.step}
                  </div>
                  <Image
                    src={card.img}
                    alt={card.title}
                    fill
                    className="object-cover"
                    onLoad={() => ScrollTrigger.refresh()}
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <h3 className={`text-xl font-bold mb-3 ${card.titleColor}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${card.descColor}`}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="block lg:hidden w-screen relative -ml-6 overflow-hidden mt-6">
            <div className="animate-card-marquee py-2">
              {[...kidsCards, ...kidsCards].map((card, idx) => (
                <div 
                  key={`mob-${idx}`} 
                  className={`w-[280px] h-[380px] shrink-0 rounded-[20px] overflow-hidden shadow-xl flex flex-col mx-3 ${card.bgColor}`}
                >
                  <div className="relative w-full h-[65%] bg-gray-200 shrink-0">
                    <div className="absolute top-4 left-4 z-10 bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-md">
                      {card.step}
                    </div>
                    <Image
                      src={card.img}
                      alt={card.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <h3 className={`text-[19px] font-bold mb-2 ${card.titleColor}`}>
                      {card.title}
                    </h3>
                    <p className={`text-[13.5px] leading-relaxed ${card.descColor}`}>
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <div className="w-full bg-[#00c3ff] py-4 border-t border-white/20 overflow-hidden relative flex items-center shrink-0 mt-auto">
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              display: inline-flex;
              white-space: nowrap;
              animation: marquee 35s linear infinite;
            }
            @keyframes cardMarquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-card-marquee {
              display: flex;
              width: max-content;
              animation: cardMarquee 20s linear infinite;
            }
            .animate-card-marquee:hover {
              animation-play-state: paused;
            }
          `}
        </style>
        <div className="animate-marquee">
          {/* 4 times map to ensure the loop is seamless */}
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center text-white font-bold tracking-widest text-sm sm:text-base shrink-0">
              <span className="mx-3 sm:mx-5">✿</span> BESPOKE FASHION
              <span className="mx-3 sm:mx-5">✿</span> TIMELESS ELEGANCE
              <span className="mx-3 sm:mx-5">✿</span> DESIGNER COLLECTION
              <span className="mx-3 sm:mx-5">✿</span> WEDDING STYLIST
              <span className="mx-3 sm:mx-5">✿</span> CUSTOM-MADE OUTFITS
              <span className="mx-3 sm:mx-5">✿</span> KIDS FASHION
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}