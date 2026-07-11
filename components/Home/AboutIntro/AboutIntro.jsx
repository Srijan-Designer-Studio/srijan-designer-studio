"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutIntro() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1320px] mx-auto px-5">

        {/* Heading */}
        <h2
          className="
            text-center
            text-[56px]
            leading-none
            font-semibold
            italic
            text-[#111111]
          "
        >
          Designed by Us, Styled for You
        </h2>

        {/* Description */}
        <p
          className="
            max-w-[1050px]
            mx-auto
            mt-10
            text-center
            text-[28px]
            leading-[46px]
            text-[#111111]
            font-normal
          "
        >
          <span className="font-bold uppercase">
            "SRIJAN"
          </span>{" "}
          is an Indian luxury fashion brand creating bridal,
          ethnic, western and custom designer wear for women,
          men and kids. We design moments, not just outfits.
        </p>

        {/* Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/about"
            className="
              inline-flex
              items-center
              gap-3
              text-[18px]
              font-semibold
              uppercase
              tracking-[1px]
              hover:gap-5
              transition-all
              duration-300
            "
          >
            ABOUT US
            <ArrowRight size={20} />
          </Link>
        </div>

      </div>
    </section>
  );
}