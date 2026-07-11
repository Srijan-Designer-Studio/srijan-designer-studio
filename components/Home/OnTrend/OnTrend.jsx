"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OnTrend() {
  return (
<section
  className="relative h-screen bg-fixed bg-center bg-cover"
  style={{
    backgroundImage: "url('/images/banner.png')",
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/35"></div>

  {/* Content */}
  <div className="relative z-10 flex h-full flex-col items-center justify-center text-white">
    <p className="text-lg uppercase tracking-widest">
      NEW FOR
    </p>

    <h1 className="text-7xl font-light text-center">
      ON TREND
      <br />
      WESTERNSTYLE
    </h1>

    <button className="mt-8 border border-white px-8 py-3 hover:bg-white hover:text-black transition">
      SHOP NOW →
    </button>
  </div>
</section>
  );
}