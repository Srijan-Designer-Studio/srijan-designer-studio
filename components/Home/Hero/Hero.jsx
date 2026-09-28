"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop
      >
        <SwiperSlide>
          <div className="relative h-screen min-h-[700px] w-full overflow-hidden">
            <Image
              src="/Home_img/HERO Section.webp"
              alt="Srijan Hero"
              fill
              priority
              className="w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6">
              <div className="text-left text-white max-w-[650px] mt-[60px] md:mt-[90px]">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.15] md:leading-[1.1] mb-4 md:mb-6 drop-shadow-md">
                  Discover Fashion Styles That's Truly Yours
                </h1>

                <p className="text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px] mb-6 md:mb-10">
                  Shop the latest fashion styles online or design a custom outfit that's 100% you
                </p>

                <div className="inline-block">
                  <Link
                    className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 rounded-full transition-colors duration-300 shadow-lg inline-block"
                    href="/shop-style"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}