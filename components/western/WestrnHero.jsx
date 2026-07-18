"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  ["/images/ethnic1.png", "/images/ethnic2.png", "/images/ethnic3.png"],
  ["/images/ethnic4.png", "/images/ethnic5.png", "/images/ethnic6.png"],
  ["/images/ethnic7.png", "/images/ethnic8.png", "/images/ethnic9.png"],
  ["/images/ethnic10.png", "/images/ethnic11.png", "/images/ethnic12.png"],
];

const WestrnHero = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".western-hero-anim",
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
    );
  }, { scope: containerRef });

  return (
    <section className="py-8 bg-[#fafafa]" ref={containerRef}>
      <div className="western-hero-anim opacity-0">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          loop
          className="pb-10"
        >
          {images.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-4">
                {slide.map((img, i) => (
                  <div
                    key={i}
                    className="relative h-[400px] md:h-[650px] bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <Image
                      src={img}
                      alt={`Western Wear ${index}-${i}`}
                      fill
                      className="object-cover md:object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default WestrnHero;