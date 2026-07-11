"use client";

import { useState } from "react";
import Image from "next/image";

const categoriesData = [
  { id: 1, title: "Sarees", imageSrc: "" },
  { id: 2, title: "Gowns", imageSrc: "" },
  { id: 3, title: "Drapes", imageSrc: "" },
  { id: 4, title: "Capes", imageSrc: "" },
  { id: 5, title: "Bridal Suits", imageSrc: "" },
];

export default function EditByCategory() {
  const [activeTab, setActiveTab] = useState("WOMEN");

  return (
    <section className="py-16 bg-gradient-to-b from-[#2d2f4d] to-[#6a6787]">
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col items-center">
        
        <h2 className="text-3xl font-bold text-white mb-6">
          Edit By Category
        </h2>

        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => setActiveTab("WOMEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 transition-colors ${
              activeTab === "WOMEN" ? "text-white border-b-2 border-white font-bold" : "text-gray-300 border-b-2 border-transparent hover:text-white"
            }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => setActiveTab("MEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 transition-colors ${
              activeTab === "MEN" ? "text-white border-b-2 border-white font-bold" : "text-gray-300 border-b-2 border-transparent hover:text-white"
            }`}
          >
            MEN
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-10 w-full max-w-[1000px] mx-auto">
          {categoriesData.map((category) => (
            <div key={category.id} className="flex flex-col items-center cursor-pointer group">
              <div className="relative w-full aspect-square rounded-full bg-[#1a1c33] overflow-hidden mb-4 border-[3px] border-transparent group-hover:border-white transition-all">
                {category.imageSrc && (
                  <Image
                    src={category.imageSrc}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
              </div>
              <span className="text-white text-[14px] font-medium tracking-wide">
                {category.title}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
