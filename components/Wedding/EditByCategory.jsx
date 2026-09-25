"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";

const womenData = [
  { id: 1, title: "Sarees", imageSrc: "/Custom Wedding Wear/Sarees.webp" },
  { id: 2, title: "Gowns", imageSrc: "/Custom Wedding Wear/Gowns.webp" },
  { id: 3, title: "Drapes", imageSrc: "/Custom Wedding Wear/Drapes.webp" },
  { id: 4, title: "Capes", imageSrc: "/Custom Wedding Wear/Capes.webp" },
  { id: 5, title: "Bridal Suits", imageSrc: "/Custom Wedding Wear/Bridal Suits.webp" },
  { id: 6, title: "Lehengas", imageSrc: "/Custom Wedding Wear/Lahengas.webp" },
];

const menData = [
  { id: 11, title: "Indo western", imageSrc: "/Custom Wedding Wear/Indowestern.webp" },
  { id: 12, title: "Kurta Sets", imageSrc: "/Custom Wedding Wear/Kurta.webp" },
  { id: 13, title: "Sherwani", imageSrc: "/Custom Wedding Wear/Sherwani.webp" },
  { id: 14, title: "Tuxedo", imageSrc: "/Custom Wedding Wear/Tuxedo.webp" },
  { id: 15, title: "Shirt", imageSrc: "/Custom Wedding Wear/Shirt.webp" },
];

export default function EditByCategory() {
  const [activeTab, setActiveTab] = useState("WOMEN");
  const [itemsPerView, setItemsPerView] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isDragging = useRef(false);

  const currentData = activeTab === "WOMEN" ? womenData : menData;
  const extendedItems = [...currentData, ...currentData, ...currentData, ...currentData];

  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else setItemsPerView(5);
    };
    updateView();
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, []);

  useEffect(() => {
    setIsTransitioning(false);
    setCurrentIndex(currentData.length);
  }, [activeTab, currentData.length]);

  const handleNext = () => {
    if (isDragging.current) return;
    isDragging.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => {
      isDragging.current = false;
    }, 400);
  };

  const handlePrev = () => {
    if (isDragging.current) return;
    isDragging.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => {
      isDragging.current = false;
    }, 400);
  };

  const handleTransitionEnd = () => {
    if (currentIndex >= currentData.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - currentData.length);
    } else if (currentIndex < currentData.length) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + currentData.length);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-[#2d2f4d] to-[#6a6787] overflow-hidden">
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col items-center relative">
        <h2 className="text-3xl font-bold text-white mb-6">Edit By Category</h2>

        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => setActiveTab("WOMEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 transition-colors cursor-pointer ${
              activeTab === "WOMEN" ? "text-white border-b-2 border-white font-bold" : "text-gray-300 border-b-2 border-transparent hover:text-white"
            }`}
          >
            WOMEN
          </button>
          <button
            onClick={() => setActiveTab("MEN")}
            className={`text-[14px] uppercase tracking-wide pb-1 transition-colors cursor-pointer ${
              activeTab === "MEN" ? "text-white border-b-2 border-white font-bold" : "text-gray-300 border-b-2 border-transparent hover:text-white"
            }`}
          >
            MEN
          </button>
        </div>

        <div className="w-full relative mx-auto py-4 px-12 max-w-[1150px]">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 border border-white text-white rounded-full flex items-center justify-center transition-colors shadow-md backdrop-blur-sm cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="w-full overflow-hidden">
            <div
              className="flex w-full"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                transition: isTransitioning ? "transform 0.4s ease-in-out" : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedItems.map((category, index) => (
                <div
                  key={index}
                  className="shrink-0 flex justify-center items-start px-2 sm:px-4"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="flex flex-col items-center w-full max-w-[170px] cursor-pointer">
                    <div className="relative w-full aspect-square rounded-full bg-[#1a1c33] overflow-hidden mb-4 shadow-lg border-[3px] border-transparent hover:border-white/20 transition-all">
                      {category.imageSrc && (
                        <Image
                          src={category.imageSrc}
                          alt={category.title}
                          fill
                          className="object-cover object-top"
                        />
                      )}
                    </div>
                    <h3 className="text-white text-[14px] font-medium tracking-wide text-center">
                      {category.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-black/30 hover:bg-black/50 border border-white text-white rounded-full flex items-center justify-center transition-colors shadow-md backdrop-blur-sm cursor-pointer"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}