"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

const EthnicProductCard = ({ item }) => {
  return (
    <div className="bg-[#fdf4f3] rounded-[24px] overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-[#f5e6e5]">

      {/* Product Image Box */}
      <Link href={`/product/${item.id}`} className="relative w-full aspect-[3/4] bg-white block overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
        />
      </Link>

      {/* Product Details */}
      <div className="text-center p-6 flex-1 flex flex-col">

        <p className="text-gray-500 text-sm tracking-widest uppercase mb-2 font-medium">
          {item.category}
        </p>

        <Link href={`/product/${item.id}`}>
          <h3 className="font-bold text-[22px] lg:text-[26px] leading-tight mt-2 text-[#111] hover:text-[#00c3ff] transition-colors line-clamp-2">
            {item.title}
          </h3>
        </Link>

        {/* Keeping item.price as you passed it, adding margin-top auto to stick it to the bottom */}
        <p className="text-[24px] font-semibold text-black mt-auto pt-4">
          ₹{item.price}
        </p>

        <Link
          href={`/product/${item.id}`}
          className="inline-block w-full mt-6 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] uppercase tracking-wide px-8 py-3.5 rounded-full transition-all shadow-md hover:-translate-y-0.5"
        >
          {item.button || "Buy Now"}
        </Link>

        {/* Wishlist Button with Hover fill effect */}
        <button className="mt-5 flex justify-center items-center gap-2 text-gray-500 hover:text-[#ff3838] transition-colors group/wishlist">
          <Heart size={18} className="group-hover/wishlist:fill-[#ff3838]" />
          <span className="text-sm font-medium">Add to Wishlist</span>
        </button>

      </div>

    </div>
  );
};

export default EthnicProductCard;