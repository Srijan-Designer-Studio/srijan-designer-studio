"use client";

import Image from "next/image";

export default function CustomizeHero() {
  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">
      <Image
        src="/Create Custom-img/Custom Dress HERO Section.webp"
        alt="Create Your Own Designer Dress"
        fill
        priority
        className="object-cover"
      />
      
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold leading-[1.15] md:leading-[1.1] mb-4 md:mb-6 drop-shadow-md ">
              Designer Dress<br />That's Only Yours
            </h1>
            <p className="text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
              No copies. No compromises. Just
              custom dresses built around your
              style, your fit and your vision: from
              the first sketch to the final stitch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}