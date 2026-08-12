"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const slides = [
  {
    id: 1,
    video: "/videos/HomePage HERO SectionVideo.mp4",
    title: "Discover Fashion That Feels Made for You",
    description: "Enjoy online shopping for outfits that match your style. Explore the latest fashion styles or create a custom dress made just for you.",
    buttonText: "Shop Now",
    href: "/shop-style",
  }
];

export default function Hero() {
  const containerRef = useRef(null);
  const [slideChangeTracker, setSlideChangeTracker] = useState(0);

  useGSAP(() => {
    gsap.fromTo(
      ".swiper-slide-active .hero-anim",
      { y: 60, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 1.2, 
        stagger: 0.15, 
        ease: "power4.out", 
        delay: 0.3 
      }
    );

    gsap.fromTo(
      ".swiper-slide-active .hero-img",
      { scale: 1.1 },
      { 
        scale: 1, 
        duration: 5, 
        ease: "power2.out" 
      }
    );
  }, { dependencies: [slideChangeTracker], scope: containerRef });

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]" ref={containerRef}>
      <Swiper
        modules={[EffectFade, Autoplay]}
        effect="fade"
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        loop
        onSlideChange={() => setSlideChangeTracker((prev) => prev + 1)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-screen min-h-[700px] w-full overflow-hidden">
              <video
                src={slide.video}
                autoPlay
                loop
                muted
                playsInline
                className="hero-img absolute inset-0 w-full h-full object-cover object-center"
              ></video>

              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>

              <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6">
                <div className="text-left text-white max-w-[650px] mt-[60px] md:mt-[90px]">
                  
                  {
                    <h1 className="hero-anim text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.15] md:leading-[1.1] mb-4 md:mb-6 drop-shadow-md">
                      {slide.title}
                    </h1>
                  }

                  <p className="hero-anim text-base sm:text-lg md:text-xl lg:text-[22px] font-medium leading-relaxed mb-6 md:mb-10 drop-shadow-sm">
                    {slide.description}
                  </p>

                  <div className="hero-anim inline-block">
                    <Link
                      className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-base md:text-lg px-8 py-3.5 md:px-10 md:py-4 rounded-full transition-colors duration-300 shadow-lg inline-block"
                      href={slide.href}
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}