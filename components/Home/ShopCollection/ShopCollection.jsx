"use client";

import { useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";

import collectionData from "./collectionData";

gsap.registerPlugin(ScrollTrigger);

export default function ShopCollection() {
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
      ".collection-title",
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" }
    )
    .fromTo(
      ".collection-btn",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" },
      "-=0.6"
    )
    .fromTo(
      ".swiper-slide",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-20" ref={containerRef}>
      <div className="max-w-[1180px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="overflow-hidden">
            <h2 className="collection-title text-[60px] font-light uppercase tracking-tight">
              SHOP BY COLLECTION
            </h2>
          </div>
          <button className="collection-btn flex items-center gap-3 text-[22px] font-medium hover:gap-5 duration-300">
            VIEW ALL PRODUCTS
            <ArrowRight size={24} />
          </button>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={3}
          spaceBetween={18}
          loop
        >
          {collectionData.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="border border-[#d8d8d8] bg-white">
                <div className="relative h-[620px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-6"
                  />
                </div>
                <div className="pb-8 flex justify-center">
                  <button
                    className="
                    border
                    border-black
                    px-8
                    py-3
                    text-lg
                    flex
                    items-center
                    gap-3
                    hover:bg-black
                    hover:text-white
                    duration-300
                  "
                  >
                    {item.title}
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}