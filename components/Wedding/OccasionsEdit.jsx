"use client";

import { useState } from "react";
import Image from "next/image";

const occasionsData = [
  { id: 1, title: "Sangeet Edits", imageSrc: "/images/collection1.png" },
  { id: 2, title: "Engagement Edits", imageSrc: "/images/collection2.png" },
  { id: 3, title: "Reception Edits", imageSrc: "/images/collection3.png" },
  { id: 4, title: "Cocktail Edits", imageSrc: "/images/collection4.png" },
  { id: 5, title: "Haldi Mehendi Edits", imageSrc: "/images/collection5.png" },
  { id: 6, title: "Pooja Edits", imageSrc: "/images/collection6.png" },
];

export default function OccasionsEdit() {
  const [activeTab, setActiveTab] = useState("WOMEN");

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col items-center">
        
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6 text-center">
          Choose Edit By Occassions
        </h2>

        <div className="flex items-center gap-8 mb-12">
          <button
            onClick={() => setActiveTab("WOMEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 border-b-2 transition-colors ${
              activeTab === "WOMEN" ? "text-black border-black font-bold" : "text-gray-500 border-transparent hover:text-black font-medium"
            }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => setActiveTab("MEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 border-b-2 transition-colors ${
              activeTab === "MEN" ? "text-black border-black font-bold" : "text-gray-500 border-transparent hover:text-black font-medium"
            }`}
          >
            MEN
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 w-full mb-12">
          {occasionsData.map((item) => (
            <div key={item.id} className="flex flex-col items-center cursor-pointer group">
              <div className="relative w-full aspect-[3/4] rounded-[16px] bg-[#293645] overflow-hidden mb-4 transition-shadow hover:shadow-xl">
                {item.imageSrc && (
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="text-[13px] sm:text-[15px] font-bold text-black text-center">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        <button className="px-8 py-3.5 bg-[#00c3ff] text-white rounded-full font-bold text-[13px] tracking-wide hover:bg-[#00a0d6] transition-colors">
          Choose Your Occassion
        </button>
        
      </div>
    </section>
  );
}
