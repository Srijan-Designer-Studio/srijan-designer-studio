"use client";

import Image from "next/image";

export default function ComingSoon() {
  return (
    <section className="bg-white pt-20">

      <div className="max-w-[1320px] mx-auto px-5">

        <div className="grid grid-cols-2 gap-3">

          {/* Left Banner */}

          <div className="relative overflow-hidden cursor-pointer">

            <Image
              src="/images/kids.png"
              alt=""
              width={650}
              height={900}
              className="w-full h-auto duration-500 hover:scale-105"
            />

          </div>

          {/* Right Banner */}

          <div className="relative overflow-hidden cursor-pointer">

            <Image
              src="/images/desiner.png"
              alt=""
              width={650}
              height={900}
              className="w-full h-auto duration-500 hover:scale-105"
            />

          </div>

        </div>

      </div>

      {/* Marquee */}

      <div className="border-y border-[#ececec] mt-8 overflow-hidden bg-white">

        <div className="flex whitespace-nowrap animate-marquee py-4">

          {[...Array(20)].map((_, i) => (

            <div
              key={i}
              className="flex items-center text-[32px] font-light uppercase tracking-wide"
            >
              <span className="mx-10">
                SALE COMING SOON!
              </span>

              <span className="text-[24px]">✱</span>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}