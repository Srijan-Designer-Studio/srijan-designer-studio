"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

const EthnicProductCard = ({ item }) => {
  return (
    <div className="bg-[#fdf4f3]">

      <Image
        src={item.image}
        alt={item.title}
        width={380}
        height={500}
        className="w-full object-cover"
      />

      <div className="text-center p-5">

        <p className="text-gray-500">
          {item.category}
        </p>

        <h3 className="font-semibold text-[28px] leading-9 mt-2">
          {item.title}
        </h3>

        <p className="text-[32px] mt-3">
          {item.price}
        </p>

        <Link
          href={`/woman/${item.slug}`}
          className="inline-block mt-5 bg-[#0067d8] hover:bg-[#0054b3] text-white px-8 py-3 rounded"
        >
          {item.button}
        </Link>

        <div className="mt-5 flex justify-center gap-2 text-[#0067d8]">
          <Heart size={20} />
          <span>Add to Wishlist</span>
        </div>

      </div>

    </div>
  );
};

export default EthnicProductCard;