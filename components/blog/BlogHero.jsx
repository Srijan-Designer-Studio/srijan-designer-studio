"use client";

import Image from "next/image";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden w-full h-screen min-h-[400px]">
      <Image
        src="/others-img/Blogs HERO Section.webp"
        alt="Our Blogs"
        fill
        priority
        className="object-cover object-top object-center"
      />
      
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-xl text-white mt-10">
            <h1 className="text-4xl md:text-5xl lg:text-[68px] font-bold mb-4 leading-tight font-serif">
              Our Blogs
            </h1>
            <p className="text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
              Stay updated with the latest fashion styles, styling guides and trend insights to help you look your best every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}