"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WestrnContent = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const sections = gsap.utils.toArray(".content-section");

    sections.forEach((section) => {
      gsap.fromTo(
        section.children,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div className="bg-white text-gray-900 min-h-screen py-16 px-6 sm:px-12 md:px-24 lg:px-48 font-sans leading-relaxed" ref={containerRef}>

      <section className="content-section mb-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black leading-tight">
          Online Shopping For Women: Find Your Style With Srijan Fashion
        </h1>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          We’ve all experienced it. You spot something online, love it instantly, order it and when it arrives, it’s just off. Wrong fit, wrong feel, nothing like you imagined.
        </p>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          That’s the part <span className="font-bold text-black">Srijan Fashion</span> is trying to fix.
        </p>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          We design outfits for women that actually work for real women. Not just pretty on a hanger, but comfortable on your body, flattering in real light and genuinely yours to wear.
        </p>
      </section>

      <section id="western-wear" className="content-section mb-16 scroll-mt-12">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">
          Ethnic, Western and Bridal — Made For You
        </h2>
        <p className="mb-6 text-gray-800 text-[16px] md:text-[17px]">
          We focus on creating outfits for women that feel right, look good and truly fit your style.
        </p>

        <div className="space-y-6 text-gray-800 text-[16px] md:text-[17px]">
          <p>
            <span className="font-bold text-black text-lg block mb-1">Everyday Western Styles:</span>
            Some days you just want to get dressed — no fuss. Our western pieces are easy, comfortable and put together for exactly those mornings.
          </p>
          <p>
            <span className="font-bold text-black text-lg block mb-1">Ethnic Wear for Special Moments:</span>
            A family gathering, a festive evening, a puja. Our anarkalis, salwar suits and ethnic women wear are made for the moments that stay with you.
          </p>
          <p>
            <span className="font-bold text-black text-lg block mb-1">Bridal and Occasion Wear:</span>
            Your wedding day should feel entirely yours. Every bridal outfit we make is built around how you want to feel and move — no cookie-cutter designs.
          </p>
          <p>
            <span className="font-bold text-black text-lg block mb-1">Custom-Made, Always:</span>
            Nothing comes off a rack. You choose the fabric, the fit, the details. That’s what makes them real designer outfits — made for you, not just made.
          </p>
        </div>
      </section>

      <section className="content-section mb-16">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">
          Why Custom-Made Matters
        </h2>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          You know that feeling when something almost fits? Too tight in one place, too long somewhere else, a colour that doesn’t quite work on you?
        </p>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          It’s exhausting. And completely avoidable.
        </p>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          All our women wear is stitched to your exact measurements, in the fabric you picked, in a style that feels like yours. No alterations after the fact. No settling.
        </p>
      </section>

      <section className="content-section mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-black">
          Your Perfect Outfit Is Waiting
        </h2>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          Whether it’s a wedding, a festival or just a Tuesday when you want to feel really good — <span className="font-bold text-black">Srijan Fashion</span> has something for you. Our designer outfits are made with care, with attention and with you in mind.
        </p>
        <p className="mb-4 text-gray-800 text-[16px] md:text-[17px]">
          Explore outfits for women built for real women — with a fit that proves it.
        </p>
        <p className="text-gray-800 text-[16px] md:text-[17px] mt-8 text-center italic">
          At <span className="font-bold text-black">Srijan Fashion</span>, your outfit isn’t just made. It’s made for you.
        </p>
      </section>

    </div>
  );
}

export default WestrnContent;