"use client";

import Image from "next/image";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">
      <Image
        src="/others-img/Contact Us HERO Section.webp"
        alt="Connect with Srijan Fashion"
        fill
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6">
          <div className="text-white drop-shadow-md mt-[90px]">
            <p className="text-lg sm:text-xl md:text-3xl font-bold mb-2">Let's</p>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[72px] font-bold leading-[1.2] md:leading-[1.1] mb-4 md:mb-6 drop-shadow-md break-words">
              Connect<br />with SRIJAN Fashion
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}