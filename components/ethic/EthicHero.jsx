"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  [
    "/images/ethnic1.png",
    "/images/ethnic2.png",
    "/images/ethnic3.png",
  ],
  [
    "/images/ethnic4.png",
    "/images/ethnic5.png",
    "/images/ethnic6.png",
  ],
   [
    "/images/ethnic7.png",
    "/images/ethnic8.png",
    "/images/ethnic9.png",
  ],
  [
    "/images/ethnic10.png",
    "/images/ethnic11.png",
    "/images/ethnic12.png",
  ],
];

const EthicHero = () => {
  return (
    <section className="py-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
      >
        {images.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-8">

              {slide.map((img, i) => (
                <div
                  key={i}
                  className="relative h-[650px]"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="33vw"
                  />
                </div>
              ))}

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default EthicHero