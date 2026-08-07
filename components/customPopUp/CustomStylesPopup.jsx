"use client";

import { useEffect, useState, useRef } from "react";
import { X, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

const popupData = [
  {
    id: 1,
    category: "Women",
    title: "Custom Styles",
    desc: "Bring to life your ideas through our custom dresses which will definitely be perfect for you. Regardless of whether you have a drawing, an idea or even a picture from which we can get the inspiration, we will help create for you a dress which is absolutely your style.",
    image: "/images/dress7.png", 
    bgColor: "bg-[#a8a8a8]", 
    link: "/custom-styles"
  },
  {
    id: 2,
    category: "Women",
    title: "Gown & Evening Styles",
    desc: "Create unforgettable memories on your important days using our customized evening outfits. They will be perfectly matched to your style, your figure and your character. Whether you prefer a classical dress or something more modern, we will help you choose a suitable outfit which will make you feel confident.",
    image: "/images/dress9.png",
    bgColor: "bg-[#a8a8a8]",
    link: "/custom-styles"
  },
  {
    id: 3,
    category: "Women",
    title: "Plus Size Styles",
    desc: "Flaunt your individual style wearing our designer dress which will definitely match and compliment your figure. The comfort and elegance of our customized outfits will make sure that you feel yourself at ease and beautiful.",
    image: "/images/ethnic1.png",
    bgColor: "bg-[#a8a8a8]",
    link: "/custom-styles"
  },
  {
    id: 4,
    category: "Women",
    title: "Petite Styles",
    desc: "Looking for a dress that is meant to suit your body with a flawless design and fitting. Our designers will craft dresses in such a way to make you look and feel great.",
    image: "/images/ethnic2.png",
    bgColor: "bg-[#a8a8a8]",
    link: "/custom-styles"
  },
  {
    id: 5,
    category: "Men",
    title: "Sangeet Edits",
    desc: "Dazzle the crowd with our premium men's ethnic wear for Sangeet. From embroidered kurtas to stylish Nehru jackets, we customize every detail to match your vibe and the occasion.",
    image: "/images/man4.png",
    bgColor: "bg-[#5c2c2c]",
    link: "/occasions/sangeet"
  },
  {
    id: 6,
    category: "Men",
    title: "Reception Styles",
    desc: "Look sharp and sophisticated on your special day. Our custom suits and sherwanis are crafted with premium fabrics and impeccable tailoring for a picture-perfect reception look.",
    image: "/images/man5.png",
    bgColor: "bg-[#1a1a1a]",
    link: "/occasions/reception"
  },
  {
    id: 7,
    category: "Kids",
    title: "Party Perfect Clicks",
    desc: "Dress your little ones in outfits as cute as their smiles. Our custom kids wear is designed with soft, child-safe fabrics ensuring they stay comfortable while looking party-ready.",
    image: "/images/kids.png",
    bgColor: "bg-[#f0f4f8]",
    link: "/kids-wear"
  },
  {
    id: 8,
    category: "Kids",
    title: "First Birthday Clicks",
    desc: "Make their first milestone extra special. Share your vision and we will stitch a magical outfit that fits perfectly and looks breathtaking in all those precious birthday photos.",
    image: "/images/kids-look4.png",
    bgColor: "bg-[#fce4ec]",
    link: "/kids-wear"
  },
  {
  id: 9,
  category: "Men",
  title: "Classic Tailoring",
  desc: "Discover timeless tailoring designed for the modern gentleman. From formal occasions to business wear, every piece is crafted with premium fabrics and exceptional attention to detail.",
  image: "/images/classic-tailoring.png",
  bgColor: "bg-[#8b7d72]",
  link: "/custom-styles"
},
{
  id: 10,
  category: "Men",
  title: "Smart Casual",
  desc: "Upgrade your everyday wardrobe with smart casual styles that combine comfort, versatility, and effortless sophistication for every occasion.",
  image: "/images/man6.png",
  bgColor: "bg-[#6f7f86]",
  link: "/custom-styles"
},
{
  id: 11,
  category: "Men",
  title: "Wedding Collection",
  desc: "Celebrate your special moments with luxurious sherwanis, suits, and traditional attire designed to make a lasting impression with elegance and confidence.",
  image: "/images/man7.png",
  bgColor: "bg-[#9a8667]",
  link: "/custom-styles"
},
{
  id: 12,
  category: "Kids",
  title: "Little Princess",
  desc: "Adorable dresses designed with soft fabrics, playful patterns, and charming details to keep your little princess comfortable, stylish, and full of confidence.",
  image: "/images/kids.png",
  bgColor: "bg-[#d8a7b8]",
  link: "/custom-styles"
},
{
  id: 13,
  category: "Kids",
  title: "Little Gentleman",
  desc: "Dress your little gentleman in stylish outfits crafted for comfort and elegance, perfect for birthdays, weddings, and every memorable occasion.",
  image: "/images/little-gentleman.png",
  bgColor: "bg-[#8a9ba8]",
  link: "/custom-styles"
},
{
  id: 14,
  category: "Kids",
  title: "Festive Fun",
  desc: "Bright and cheerful festive wear designed for active kids, combining vibrant colors, premium fabrics, and all-day comfort for every celebration.",
  image: "/images/festive-kids.png",
  bgColor: "bg-[#c9a66b]",
  link: "/custom-styles"
}
];

export default function CustomStylesPopup({ isOpen, onClose, category }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const filteredData = popupData.filter(item => item.category === category);

  useEffect(() => {
    if (!isOpen) return;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    activeIndexRef.current = 0;
    setActiveIndex(0);
    isAnimatingRef.current = false;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if (isAnimatingRef.current) return;

      if (e.deltaY > 20 && activeIndexRef.current < filteredData.length - 1) {
        isAnimatingRef.current = true;
        activeIndexRef.current += 1;
        setActiveIndex(activeIndexRef.current);
        setTimeout(() => { isAnimatingRef.current = false; }, 700);
      } else if (e.deltaY < -20 && activeIndexRef.current > 0) {
        isAnimatingRef.current = true;
        activeIndexRef.current -= 1;
        setActiveIndex(activeIndexRef.current);
        setTimeout(() => { isAnimatingRef.current = false; }, 700);
      }
    };

    let startY = 0;
    const handleTouchStart = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    const handleTouchEnd = (e) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      const endY = e.changedTouches[0].clientY;
      const diff = startY - endY;

      if (isAnimatingRef.current) return;

      if (diff > 50 && activeIndexRef.current < filteredData.length - 1) {
        isAnimatingRef.current = true;
        activeIndexRef.current += 1;
        setActiveIndex(activeIndexRef.current);
        setTimeout(() => { isAnimatingRef.current = false; }, 700);
      } else if (diff < -50 && activeIndexRef.current > 0) {
        isAnimatingRef.current = true;
        activeIndexRef.current -= 1;
        setActiveIndex(activeIndexRef.current);
        setTimeout(() => { isAnimatingRef.current = false; }, 700);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: false, capture: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false, capture: true });

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });
      window.removeEventListener("touchend", handleTouchEnd, { capture: true });
    };
  }, [isOpen, category, filteredData.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all overscroll-none" data-lenis-prevent="true">
      <div className="relative w-[95vw] md:w-[85vw] max-w-[1200px] h-[85vh] md:h-[80vh] bg-white rounded-2xl md:rounded-none shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={36} className="text-gray-800 hover:text-black" strokeWidth={1.5} />
        </button>

        {activeIndex < filteredData.length - 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center justify-center text-gray-500 animate-bounce pointer-events-none drop-shadow-md">
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1">Scroll</span>
            <ChevronDown size={20} strokeWidth={2} />
          </div>
        )}

        {filteredData.length > 1 && (
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-[60] flex flex-col gap-3">
            {filteredData.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 rounded-full transition-all duration-500 ${
                  activeIndex === index ? "bg-black h-8" : "bg-gray-300 h-2"
                }`}
              />
            ))}
          </div>
        )}

        <div 
          className="w-full h-full flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] pointer-events-none"
          style={{ transform: `translateY(-${activeIndex * 100}%)` }}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div 
                key={item.id} 
                className="w-full h-full flex-none flex flex-col md:flex-row relative pointer-events-auto"
              >
                <div className={`w-full md:w-1/2 h-[45%] md:h-full relative ${item.bgColor} flex items-center justify-center`}>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                <div className="w-full md:w-1/2 h-[55%] md:h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-white relative">
                  <Link href={item.link || "#"} onClick={onClose} className="group/link cursor-pointer inline-block mb-6 w-fit">
                    <div className="flex items-center gap-4 md:gap-6">
                      <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-black tracking-tight leading-tight">
                        {item.title}
                      </h2>
                      <ArrowRight size={32} strokeWidth={1.5} className="text-gray-800 group-hover/link:text-black group-hover/link:translate-x-2 transition-all duration-300 shrink-0" />
                    </div>
                  </Link>

                  <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed md:leading-loose max-w-[90%] md:max-w-md">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
              No styles available right now.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}