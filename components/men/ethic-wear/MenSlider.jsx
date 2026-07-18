"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

gsap.registerPlugin(ScrollTrigger);

const slides = [
  "/images/man1.png",
  "/images/man2.png",
  "/images/man3.png",
  "/images/man4.png",
  "/images/man5.png",
  "/images/man6.png",
  "/images/man7.png",
  "/images/man8.png",
  "/images/man9.png",
];

export default function MenSlider() {
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
      ".slider-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".slider-anim",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power4.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 bg-white overflow-hidden" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto px-6">

        <h2 className="slider-head text-3xl md:text-4xl font-bold text-center text-[#111] mb-12 font-serif">
          Trending Men's Collection
        </h2>

        <div className="slider-anim opacity-0">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            loop={true}
            navigation
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            // Added breakpoints for perfect mobile and tablet view
            breakpoints={{
              320: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14" // Added padding so the pagination dots don't overlap with images
          >
            {slides.map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-[450px] md:h-[550px] lg:h-[650px] bg-[#f9f9f9] rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                  <Image
                    src={image}
                    alt={`Men Fashion ${index + 1}`}
                    fill
                    className="object-cover md:object-contain p-2 md:p-4 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}