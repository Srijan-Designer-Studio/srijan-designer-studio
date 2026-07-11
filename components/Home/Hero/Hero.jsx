"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    image: "/images/banner1.png", 
    title: "Discover Fashion That Feels Made for You",
    description:
      "Enjoy online shopping for outfits that match your style. Explore the latest fashion styles or create a custom dress made just for you.",
    buttonText: "Shop Now",
    href: "/product",
  },
  {
    id: 2,
    image: "/images/banner2.png", 
    title: "Discover Fashion That Feels Made for You",
    description:
      "Enjoy online shopping for outfits that match your style. Explore the latest fashion styles or create a custom dress made just for you.",
    buttonText: "Shop Now",
    href: "/product",
  },
];

export default function Hero() {
  return (
    
    <section className="relative -mt-[90px]">
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-screen min-h-[700px] w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={slide.id === 1}
                className="object-cover object-center"
              />

              
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>

              <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6">
                
                
                <div className="text-left text-white max-w-[650px] mt-[90px]">
                  
                  <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.1] mb-6 font-serif drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="text-lg md:text-xl lg:text-[22px] font-medium leading-relaxed mb-10 drop-shadow-sm">
                    {slide.description}
                  </p>

                  {/* Cyan Rounded Button */}
                  <Link
                    className="
                      bg-[#00c3ff] 
                      hover:bg-[#00abe0] 
                      text-white 
                      font-bold 
                      text-lg 
                      px-10 
                      py-4 
                      rounded-full 
                      transition-colors 
                      duration-300
                      shadow-lg
                    "
                    href={slide.href}
                  >
                    {slide.buttonText}
                  </Link>
                  
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}