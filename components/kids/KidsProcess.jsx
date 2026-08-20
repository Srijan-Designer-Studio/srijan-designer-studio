"use client";

import { useRef } from "react";
import { Scissors, PenTool, Ruler, Truck, UserCheck } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function KidsProcess() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".process-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".process-step",
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-[#eef1f6]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="process-head text-3xl md:text-4xl font-bold text-black mb-16">Trusted By Parents</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="process-step flex flex-col items-center">
            <Scissors size={48} strokeWidth={1.5} className="mb-4 text-black" />
            <h3 className="font-bold text-black mb-2">Pick your fabric</h3>
            <p className="text-[19px] text-gray-600 max-w-[200px]">Choose the fabric and colour for your kid.</p>
          </div>
          <div className="process-step flex flex-col items-center">
            <PenTool size={48} strokeWidth={1.5} className="mb-4 text-black" />
            <h3 className="font-bold text-black mb-2">Design a dress</h3>
            <p className="text-[19px] text-gray-600 max-w-[200px]">Share your ideas and create your kid perfect look.</p>
          </div>
          <div className="process-step flex flex-col items-center">
            <Ruler size={48} strokeWidth={1.5} className="mb-4 text-black" />
            <h3 className="font-bold text-black mb-2">Get measured</h3>
            <p className="text-[19px] text-gray-600 max-w-[200px]">Send your measurements for a perfect fit.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-10 md:gap-32">
          <div className="process-step flex flex-col items-center">
            <UserCheck size={48} strokeWidth={1.5} className="mb-4 text-black" />
            <h3 className="font-bold text-black mb-2">Consult with designer</h3>
            <p className="text-[19px] text-gray-600 max-w-[200px]">Discuss your vision with fashion designer.</p>
          </div>
          <div className="process-step flex flex-col items-center">
            <Truck size={48} strokeWidth={1.5} className="mb-4 text-black" />
            <h3 className="font-bold text-black mb-2">Get delivered</h3>
            <p className="text-[19px] text-gray-600 max-w-[200px]">Receive your custom-made dress at your doorstep.</p>
          </div>
        </div>
      </div>
    </section>
  );
}