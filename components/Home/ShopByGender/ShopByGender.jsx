// components/ShopByGender.jsx
"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    label: "For Men",
    href: "/shop/men",
    image: "/images/man.png",
  },
  {
    label: "For Women",
    href: "/shop/women",
    image: "/images/woman.png",
  },
];

export default function ShopByGender() {
  return (
    <section className="bg-white px-6 py-16 md:px-10">
      <h2 className="mb-10 text-center text-3xl font-bold tracking-wide text-neutral-900 md:text-[42px]">
        Shop By Gender
      </h2>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-2">
        {categories.map((cat) => (
          <Link
            href={cat.href}
            key={cat.label}
            className="group flex flex-col overflow-hidden rounded-md border border-neutral-100 bg-white p-3 transition-shadow duration-300 hover:shadow-lg"
          >
            {/* Image area with white padding around, like the screenshot */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-white">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 720px) 100vw, 50vw"
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Peach/pink label bar at bottom */}
            <div className="mt-3 flex items-center justify-center gap-2 rounded-sm bg-[#fbeeea] py-4 text-lg font-semibold text-neutral-900">
              {cat.label}
              <span className="text-lg text-neutral-900 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                &#8594;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}