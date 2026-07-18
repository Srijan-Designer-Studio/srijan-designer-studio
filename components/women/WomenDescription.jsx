"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WomenDescription() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const elements = gsap.utils.toArray(".women-desc-anim");

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
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section className="py-16 bg-[#f4f5f8]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="text-[15px] sm:text-[16px] text-[#333] leading-[1.8] max-w-[900px] mx-auto">

          <h2 className="women-desc-anim text-xl sm:text-2xl font-bold text-black mb-4 leading-snug">
            Online Shopping For Women: Find Your Style With SRIJAN Fashion
          </h2>
          <p className="women-desc-anim mb-4">
            We've all experienced it. You spot something online, love it instantly, order it and when it arrives, it's just off. Wrong fit, wrong feel, nothing like you imagined.
          </p>
          <p className="women-desc-anim mb-4">
            That's the part <strong className="font-bold text-black">SRIJAN Fashion</strong> is trying to fix.
          </p>
          <p className="women-desc-anim mb-12">
            We design outfits for women that actually work for real women. Not just pretty on a hanger, but comfortable on your body, flattering in real light and genuinely yours to wear.
          </p>

          <h2 className="women-desc-anim text-xl sm:text-2xl font-bold text-black mb-4 leading-snug">
            Ethnic, Western and Bridal — Made For You
          </h2>
          <p className="women-desc-anim mb-6">
            We focus on creating outfits for women that feel right, look good and truly fit your style.
          </p>
          <ul className="women-desc-anim list-disc pl-5 mb-12 space-y-4 marker:text-black">
            <li>
              <strong className="font-bold text-black">Everyday Western Styles:</strong> Some days you just want to get dressed — no fuss. Our western pieces are easy, comfortable and put together for exactly those mornings.
            </li>
            <li>
              <strong className="font-bold text-black">Ethnic Wear for Special Moments:</strong> A family gathering, a festive evening, a puja. Our anarkalis, salwar suits and ethnic women wear are made for the moments that stay with you.
            </li>
            <li>
              <strong className="font-bold text-black">Bridal and Occasion Wear:</strong> Your wedding day should feel entirely yours. Every bridal outfit we make is built around how you want to feel and move — no cookie-cutter designs.
            </li>
            <li>
              <strong className="font-bold text-black">Custom-Made, Always:</strong> Nothing comes off a rack. You choose the fabric, the fit, the details. That's what makes them real designer outfits — made for you, not just made.
            </li>
          </ul>

          <h2 className="women-desc-anim text-xl sm:text-2xl font-bold text-black mb-4 leading-snug">
            Why Custom-Made Matters
          </h2>
          <p className="women-desc-anim mb-4">
            You know that feeling when something almost fits? Too tight in one place, too long somewhere else, a colour that doesn't quite work on you?
          </p>
          <p className="women-desc-anim mb-4">
            It's exhausting. And completely avoidable.
          </p>
          <p className="women-desc-anim mb-12">
            All our women wear is stitched to your exact measurements, in the fabric you picked, in a style that feels like yours. No alterations after the fact. No settling.
          </p>

          <h2 className="women-desc-anim text-xl sm:text-2xl font-bold text-black mb-4 leading-snug">
            Your Perfect Outfit is Waiting
          </h2>
          <p className="women-desc-anim mb-4">
            Whether it's a wedding, a festival or just a Tuesday when you want to feel really good — <strong className="font-bold text-black">SRIJAN Fashion</strong> has something for you. Our designer outfits are made with care, with attention and with you in mind.
          </p>
          <p className="women-desc-anim mb-8">
            Explore outfits for women built for real women — with a fit that proves it.
          </p>
          <p className="women-desc-anim italic">
            At <strong className="font-bold text-black not-italic">SRIJAN Fashion</strong>, your outfit isn't just made. It's made for you.
          </p>

        </div>
      </div>
    </section>
  );
}