"use client";

import { useEffect, useState, useRef } from "react";
import { X, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";

const popupData = [
  {
    id: 1,
    category: "Women",
    title: "Sangeet Edits",
    desc: "Get ready to have fun with our range of sangeet clothes that are specially designed to make the celebration fun for you. Our wedding wear range is comfortable and easy to dance in. You can add your own unique touch to it with different colors and embroidery work.",
    image: "/Custom Wedding Wear/Women Card 1.webp",
    bgColor: "bg-[#a8a8a8]",
  },
  {
    id: 2,
    category: "Women",
    title: "Engagement Edits",
    desc: "Start your journey with a gown that will make you feel like you belong to a fairytale. Our engagement dresses have a unique mix of modern style and classic elegance and every moment you spend in such dress will look like a photo shoot. Adjust all the details of your outfit according to your personal preferences and the history of your love.",
    image: "/Custom Wedding Wear/Women Card 2.webp",
    bgColor: "bg-[#a8a8a8]",
  },
  {
    id: 3,
    category: "Women",
    title: "Reception Edits",
    desc: "Finish off your wedding celebration by wearing something elegant and comfortable. Our reception dresses are made to help you be yourself at the same time looking gorgeous, enjoying every smile and dance, and taking the most wonderful pictures. Customize all the details of the outfit to make it yours.",
    image: "/Custom Wedding Wear/Women Card 3.webp",
    bgColor: "bg-[#a8a8a8]",
  },
  {
    id: 4,
    category: "Women",
    title: "Cocktail Edits",
    desc: "Make the evening unforgettable with a modern gown that makes you feel confident and luxurious. Cocktail styles are perfect for all the pre-wedding celebration parties.",
    image: "/Custom Wedding Wear/Women Card 4.webp",
    bgColor: "bg-[#a8a8a8]",
  },
  {
    id: 5,
    category: "Women",
    title: "Haldi Mehendi Edits",
    desc: "Let's celebrate the most colorful days with our bright and stylish outfits. All the Haldi and Mehendi styles are created to be fun, stylish and comfy so that you could have the best memories in your life. Get your outfit personalized to make sure it will fit your individual style.",
    image: "/Custom Wedding Wear/Women Card 5.webp",
    bgColor: "bg-[#a8a8a8]",
  },
  {
    id: 6,
    category: "Women",
    title: "Pooja Edits",
    desc: "Honor every pooja day with our traditional but still modern outfits. We know that all the Pooja outfits should be elegant and comfy and we are here to make sure that you will look fabulous on these special days. Make your outfit yours!",
    image: "/Custom Wedding Wear/Women Card 6.webp",
    bgColor: "bg-[#a8a8a8]",
  },
  {
    id: 7,
    category: "Men",
    title: "Sangeet Edits",
    desc: "Show the power of your performances with our stylish and festive looks. Our Sangeet outfits are always stylish and they are made to help you shine. Create your own unique style!",
    image: "/Custom Wedding Wear/Men Card 1.webp",
    bgColor: "bg-[#5c2c2c]",
  },
  {
    id: 8,
    category: "Men",
    title: "Engagement Edits",
    desc: "Create a lasting first impression through a fashionable look that exudes confidence and elegance. Our styles of engagement are customized to suit your personality and still make you look elegant. Customize your outfit in all aspects to ensure that it is perfect for your special day.",
    image: "/Custom Wedding Wear/Men Card 2.webp",
    bgColor: "bg-[#5c2c2c]",
  },
  {
    id: 9,
    category: "Men",
    title: "Reception Edits",
    desc: "Enjoy a sophisticated grand entry through a look that is elegant and fashionable. Our styles of reception are modern to suit your personality and make you comfortable throughout your reception party. Customize all aspects of your outfit in order to suit your personality.",
    image: "/Custom Wedding Wear/Men Card 3.webp",
    bgColor: "bg-[#5c2c2c]",
  },
  {
    id: 10,
    category: "Men",
    title: "Cocktail Edits",
    desc: "Step out into the party with confidence through a sophisticated fashion style. Our styles of cocktails are modern and will allow you to enjoy the party in a more comfortable way. Customize your outfit to suit your personality.",
    image: "/Custom Wedding Wear/Men Card 4.webp",
    bgColor: "bg-[#5c2c2c]",
  },
  {
    id: 11,
    category: "Men",
    title: "Haldi Mehendi Edits",
    desc: "Dress up in the best of colors and have fun with your wedding ceremonies wearing outfits that not only feel comfortable but also have an exclusive touch of fashion. The Haldi and Mehendi dresses are meant to give you ease and grace at the same time. Customize the elements and get yourself an exclusive outfit.",
    image: "/Custom Wedding Wear/Men Card 5.webp",
    bgColor: "bg-[#5c2c2c]",
  },
  {
    id: 12,
    category: "Men",
    title: "Pooja Edits",
    desc: "Adorn yourself in traditions and elegance with an outfit that exudes simplicity and grace. Our Pooja collection is designed to give you comfort, sophistication and classicism in each ritual outfit. Customize the elements and get yourself an exclusive outfit.",
    image: "/Custom Wedding Wear/Men Card 6.webp",
    bgColor: "bg-[#5c2c2c]",
  },
  {
    id: 13,
    category: "Kids",
    title: "Party Perfect Clicks",
    desc: "Dress up your little one in style with dresses designed exclusively for kids. Choose from various options to customize the dress with your desired style, color, fabric and finishings. We ensure that kids look stylish yet comfortable in all occasions including parties, gatherings and school functions.",
    image: "/Custom Kids Wear/Kids Card 1.webp",
    bgColor: "bg-[#f0f4f8]",
  },
  {
    id: 14,
    category: "Kids",
    title: "Everyday Happy Clicks",
    desc: "Be it playdates, family lunch outings or any other events, every day calls for a little dressing up. Customize wear offers you the opportunity to have comfortable and adorable dresses tailored especially for your kid. Choose from different fabric options, colors, styles and we will create a dress which not only makes your kid comfortable but adds sparkle to all such occasions.",
    image: "/Custom Kids Wear/Kids Card 2.webp",
    bgColor: "bg-[#f0f4f8]",
  },
  {
    id: 15,
    category: "Kids",
    title: "Magical Theme Clicks",
    desc: "Make your kid's dreams come true in a dress designed especially for the occasion. From creating unique party dresses inspired from favorite characters, colors or themes to anything else you like, customize wear offers the perfect solution to celebrate birthdays or other occasions with comfort and fun.",
    image: "/Custom Kids Wear/Kids Card 3.webp",
    bgColor: "bg-[#f0f4f8]",
  },
  {
    id: 16,
    category: "Kids",
    title: "First Birthday Clicks",
    desc: "There is no better way to commemorate the special day than to dress your kid up in a unique birthday dress. Customize kids wear services offer you the opportunity to create a unique birthday dress which not only compliments the theme of your party but also is very comfortable for cake smashes.",
    image: "/Custom Kids Wear/Kids Card 4.webp",
    bgColor: "bg-[#f0f4f8]",
  },
  {
    id: 17,
    category: "Kids",
    title: "Picture-Perfect Gown Clicks",
    desc: "Make your child feel special by dressing her up in a gown that is designed specially for her. Our customize kids wear services offer you an opportunity to get a gown of your choice and according to your requirements. No matter whether you wish to dress your child up for her birthday party, a wedding or a photoshoot, our outfits will suit her perfectly.",
    image: "/Custom Kids Wear/Kids Card 5.webp",
    bgColor: "bg-[#f0f4f8]",
  },
  {
    id: 18,
    category: "Kids",
    title: "Festive Ethnic Clicks",
    desc: "Make your child look traditional by dressing her up in the most stylish manner. Our kids wear services provide you with the facility of designing ethnic dresses for festivals, weddings, puja ceremonies and other family occasions. Let us know your requirements and we will do the rest.",
    image: "/Custom Kids Wear/Kids Card 6.webp",
    bgColor: "bg-[#f0f4f8]",
  },
  {
    id: 19,
    category: "Customize",
    title: "Custom Styles",
    desc: "Bring to life your ideas through our custom dresses which will definitely be perfect for you. Regardless of whether you have a drawing, an idea or even a picture from which we can get the inspiration, we will help create for you a dress which is absolutely your style.",
    image: "/Create Custom-img/Card 1.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 20,
    category: "Customize",
    title: "Gown & Evening Styles",
    desc: "Create unforgettable memories on your important days using our customized evening outfits. They will be perfectly matched to your style, your figure and your character. Whether you prefer a classical dress or something more modern, we will help you choose a suitable outfit which will make you feel confident.",
    image: "/Create Custom-img/Card 2.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 21,
    category: "Customize",
    title: "Plus Size Styles",
    desc: "Flaunt your individual style wearing our designer dress which will definitely match and compliment your figure. The comfort and elegance of our customized outfits will make sure that you feel yourself at ease and beautiful.",
    image: "/Create Custom-img/Card 3.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 22,
    category: "Customize",
    title: "Petite Styles",
    desc: "Looking for a dress that is meant to suit your body with a flawless design and fitting. Our designers will craft dresses in such a way to make you look and feel great.",
    image: "/Create Custom-img/Card 4.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 23,
    category: "Customize",
    title: "Sheath Styles",
    desc: "Do you want to look sleek and elegant? We have our sheath designs which are meant to suit your body perfectly with a designer dress to go with your style and needs. Whether it be to work, party or any other special occasion, we offer you a designer dress that suits your style and makes you look unique and beautiful.",
    image: "/Create Custom-img/Card 5.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 24,
    category: "Customize",
    title: "A-Line Styles",
    desc: "An a-line dress is an elegant dress that is liked by many women because of its timeless design. We craft each dress to suit your body type and to reflect your unique style and needs.",
    image: "/Create Custom-img/Card 6.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 25,
    category: "Customize",
    title: "Wrap Styles",
    desc: "Wrap Dresses give the best combination of comfort, style and a fabulous fit. Every dress is designed to complement your body type and your unique taste. From classic designs to contemporary designer dresses, all the dresses that you desire are customized according to your choice.",
    image: "/Create Custom-img/Card 7.webp",
    bgColor: "bg-[#c9a66b]",
  },
  {
    id: 26,
    category: "Customize",
    title: "Long Sleeves Styles",
    desc: "Long sleeve dresses give an elegant yet comfortable and chic appearance to your outfit. We tailor each design to your measurements and preferences, so it fits beautifully and feels just right. No matter whether you desire a casual dress or something more extravagant, the long sleeve dress is crafted with utmost dedication and perfection.",
    image: "/Create Custom-img/Card 8.webp",
    bgColor: "bg-[#c9a66b]",
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
                className={`w-2 rounded-full transition-all duration-500 ${activeIndex === index ? "bg-black h-8" : "bg-gray-300 h-2"
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
                  <div className="group/link  inline-block mb-6 w-fit">
                    <div className="flex items-center gap-4 md:gap-6">
                      <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-black tracking-tight leading-tight">
                        {item.title}
                      </h2>
                      
                    </div>
                  </div>

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