"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  return (
    <section className="py-10">

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={3}
        spaceBetween={20}
        loop={true}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-[650px]">
              <Image
                src={image}
                alt="Men Fashion"
                fill
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

    </section>
  );
}