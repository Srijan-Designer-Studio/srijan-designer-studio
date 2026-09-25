// WeddingHero_2.jsx
"use client";

import Image from "next/image";

export default function WeddingHero() {
  const bgImageSrc = "/Custom Wedding Wear/Custom Wedding Wear HERO Section.webp";

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {bgImageSrc && (
          <Image
            src={bgImageSrc}
            alt="Wedding Edit"
            fill
            priority
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-4 sm:px-6 w-full z-20">
        <div className="max-w-[550px] mt-[90px]">
          <h1 className="text-4xl sm:text-5xl md:text-[72px] font-bold text-white mb-4 sm:mb-6 drop-shadow-lg leading-[1.2] sm:leading-[1.1] break-words">
            The Wedding<br />Wear Edit
          </h1>
          <p className="text-base sm:text-lg lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
            Shop wedding dresses that feels like you or design one from scratch. It's your day, so it's your call
          </p>
        </div>
      </div>
    </section>
  );
}