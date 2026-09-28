"use client";

import Image from "next/image";

export default function AboutHero() {
  const bgImageSrc = "/About-img/About Us HERO Section.webp";

  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">

      <div className="absolute inset-0 w-full h-full z-0">
        {bgImageSrc ? (
          <Image
            src={bgImageSrc}
            alt="About Srijan Fashion"
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 flex items-center justify-center">
            <span className="text-white/50 font-bold tracking-widest px-4 py-2 text-sm uppercase">
              HERO BACKGROUND IMAGE
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        <div className="max-w-[700px] mt-[90px]">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Where Your Story
            Becomes Your Style
          </h1>
          <p className="text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
            From designer outfits to fully custom
            pieces, everything at SRIJAN starts
            with one thing, your vision.
          </p>
        </div>
      </div>

    </section>
  );
}