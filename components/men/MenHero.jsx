"use client";

import Image from "next/image";

export default function MenHero() {
  const bgImageSrc = "/others-img/For Men HERO Section.webp";

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">
      
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {bgImageSrc && (
          <Image
            src={bgImageSrc}
            alt="Shop Stylish Outfits for Men"
            fill
            priority
            className="object-cover object-center"
          />
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        <div className="max-w-[700px] mt-[90px]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Shop Stylish <br className="hidden sm:block" />
            Outfits for Men
          </h1>

          <p className="text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
            Explore premium men wear, from ethnic and western styles to custom men outfits designed for every occasion.
          </p>
        </div>
      </div>
      
    </section>
  );
}