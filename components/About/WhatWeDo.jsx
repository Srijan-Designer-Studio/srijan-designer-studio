"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    title: "For The Trendsetters (Ready-to-Wear):",
    description: "Brunch calls for breezy Western. The office party wants a sharp Indo-Western. Family functions demand timeless Ethnic. We've got all three, curated for women who never do basic."
  },
{
  title: "For The Dreamers (Bridal & Custom):",
    description: "Your wedding outfit isn't just fabric, it's the one memory everyone will zoom into forever. Our Bridal team builds trousseaus thread by thread. Got a design only you can see? Our \"Scratch-to-Reality\" service makes it wearable."
},
{
  title: "For The Little Ones (Kids Section):",
    description: "Grown-ups don't get to have all the fun. Birthday gowns, festive kurtas, whatever it takes for your little one to (comfortably) steal every photo at the party."
},
{
  title: "For The Visionaries (Production Hub):",
    description: "We're makers, top to bottom. Beyond our own label, we manufacture for other brands too, one piece or a thousand, same obsession with quality. You dream up the brand. We run the machines."
}
];

export default function WhatWeDo() {
  const containerRef = useRef(null);
  const imageSrc = "/About-img/12.webp";

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".wwd-img",
      { x: -50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      ".wwd-text",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.6"
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 lg:py-32 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">


          <div className="w-full flex justify-center lg:justify-start pt-10 pb-8 lg:pt-16 lg:pb-12 order-2 lg:order-1">
            <div className="wwd-img relative w-full max-w-[320px] sm:max-w-[380px] aspect-[4/5] mx-auto lg:mx-0">
              {imageSrc ? (
                <div className="absolute inset-x-0 bottom-0 h-[115%] lg:h-[120%] z-10 pointer-events-none">
                  <Image
                    src={imageSrc}
                    alt="Srijan Fashion Mannequin"
                    fill
                    className="object-contain object-bottom rounded-3xl drop-shadow-2xl pointer-events-auto"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-gray-500 font-bold tracking-widest bg-white px-4 py-2 rounded-lg text-sm uppercase shadow-sm border border-gray-100">
                    WHAT WE DO IMAGE
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-[650px] order-1 lg:order-2">
            <h2 className="wwd-text text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-6">
              What We Do
            </h2>
            <p className="wwd-text text-[16px] lg:text-[17px] text-gray-800 leading-relaxed mb-8">
              We are not just a boutique; we are a full-spectrum fashion hub.
            </p>
            <ul className="space-y-6 list-disc pl-5 marker:text-black">
              {servicesData.map((service, index) => (
                <li key={index} className="wwd-text pl-2">
                  <p className="text-[19px] lg:text-[17px] leading-[1.65] text-gray-800">
                    <strong className="font-bold text-black">
                      {service.title}
                    </strong>{" "}
                    {service.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}