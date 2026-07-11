"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import collectionData from "./collectionData";

export default function ShopCollection() {
  return (
    <section className="py-20">

      <div className="max-w-[1180px] mx-auto">

        {/* Heading */}

        <div className="flex items-center justify-between mb-12">

          <h2 className="text-[60px] font-light uppercase tracking-tight">

            SHOP BY COLLECTION

          </h2>

          <button className="flex items-center gap-3 text-[22px] font-medium hover:gap-5 duration-300">

            VIEW ALL PRODUCTS

            <ArrowRight size={24} />

          </button>

        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          slidesPerView={3}
          spaceBetween={18}
          loop
        >
          {collectionData.map((item) => (
            <SwiperSlide key={item.id}>

              <div className="border border-[#d8d8d8] bg-white">

                <div className="relative h-[620px]">

                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-6"
                  />

                </div>

                <div className="pb-8 flex justify-center">

                  <button
                    className="
                    border
                    border-black
                    px-8
                    py-3
                    text-lg
                    flex
                    items-center
                    gap-3
                    hover:bg-black
                    hover:text-white
                    duration-300
                  "
                  >
                    {item.title}

                    <ArrowRight size={20} />

                  </button>

                </div>

              </div>

            </SwiperSlide>
          ))}
        </Swiper>

      </div>

    </section>
  );
}