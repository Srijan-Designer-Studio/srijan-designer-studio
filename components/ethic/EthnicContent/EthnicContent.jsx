"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EthnicContent = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Get all elements with the 'text-anim' class
    const elements = gsap.utils.toArray(".text-anim");

    // Apply scroll trigger to each paragraph/heading individually for a smooth reading experience
    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%", // Animates slightly before coming fully into view
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section className="bg-white py-24" ref={containerRef}>
      {/* Reduced max-width for better reading measure (Editorial style) */}
      <div className="max-w-[900px] mx-auto px-6">
        
        <h2 className="text-anim text-3xl md:text-[34px] font-bold font-serif text-[#111] mb-8 leading-snug">
          Online Shopping For Women: Find Your Style With Srijan Fashion
        </h2>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-6">
          We’ve all experienced it. You spot something online, love it instantly,
          order it and when it arrives, it’s just off. Wrong fit, wrong feel,
          nothing like you imagined.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-6">
          That’s the part <strong className="font-bold text-black">Srijan Fashion</strong> is trying to fix.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-16">
          We design outfits for women that actually work for real women. Not just
          pretty on a hanger, but comfortable on your body, flattering in real
          light and genuinely yours to wear.
        </p>

        <h2 className="text-anim text-2xl md:text-[28px] font-bold font-serif text-[#111] mb-8 leading-snug">
          Ethnic, Western and Bridal — Made For You
        </h2>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          We focus on creating outfits for women that feel right, look good and
          truly fit your style.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          <strong className="font-bold text-black">Everyday Western Styles:</strong> Some days you just want to get
          dressed — no fuss. Our western pieces are easy, comfortable and put
          together for exactly those mornings.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          <strong className="font-bold text-black">Ethnic Wear for Special Moments:</strong> A family gathering, a
          festive evening, a puja. Our anarkalis, salwar suits and ethnic women
          wear are made for the moments that stay with you.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          <strong className="font-bold text-black">Bridal and Occasion Wear:</strong> Your wedding day should feel
          entirely yours. Every bridal outfit we make is built around how you want
          to feel and move — no cookie-cutter designs.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-16">
          <strong className="font-bold text-black">Custom-Made, Always:</strong> Nothing comes off a rack. You
          choose the fabric, the fit, the details. That’s what makes them real
          designer outfits — made for you, not just made.
        </p>

        <h2 className="text-anim text-2xl md:text-[28px] font-bold font-serif text-[#111] mb-8 leading-snug">
          Why Custom-Made Matters
        </h2>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          You know that feeling when something almost fits? Too tight in one
          place, too long somewhere else, a colour that doesn’t quite work on
          you?
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          It’s exhausting. And completely avoidable.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-16">
          All our women wear is stitched to your exact measurements, in the fabric
          you picked, in a style that feels like yours. No alterations after the
          fact. No settling.
        </p>

        <h2 className="text-anim text-2xl md:text-[28px] font-bold font-serif text-[#111] mb-8 leading-snug">
          Your Perfect Outfit is Waiting
        </h2>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          Whether it’s a wedding, a festival or just a Tuesday when you want to
          feel really good — <strong className="font-bold text-black">Srijan Fashion</strong> has something for
          you. Our designer outfits are made with care, with attention and with
          you in mind.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] mb-8">
          Explore outfits for women built for real women — with a fit that proves
          it.
        </p>

        <p className="text-anim text-lg md:text-[19px] text-gray-700 leading-[1.8] italic font-medium">
          At <strong className="font-bold text-black not-italic">Srijan Fashion</strong>, your outfit isn’t just made. It’s
          made for you.
        </p>

      </div>
    </section>
  );
};

export default EthnicContent;