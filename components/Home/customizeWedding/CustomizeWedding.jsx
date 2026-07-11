import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Data array for the wedding images to keep the code clean
const weddingImages = [
  {
    id: 1,
    src: "/images/bidalinquery.png", 
    alt: "Pink Bridal Lehenga",
    placeholderBg: "bg-[#fbcfe8]", 
  },
  {
    id: 2,
    src: "/images/product2.png", 
    alt: "Couple Wedding Outfit",
    placeholderBg: "bg-[#fecdd3]", 
  },
  {
    id: 3,
    src: "/images/product2.png", 
    alt: "Red Bridal Lehenga",
    placeholderBg: "bg-[#e5e7eb]", 
  },
];

export default function CustomizeWedding() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        
        {/* Top Content Area */}
        <div className="max-w-[850px] mx-auto mb-12">
          
          {/* Red Subheading */}
          <span className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
            CUSTOMIZE WEDDING WEAR
          </span>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#111] leading-[1.3] mb-6">
            Your Dream Wedding Outfit, Made for You
          </h2>

          {/* Description Paragraph */}
          <p className="text-[#444] text-base sm:text-[19px] leading-[1.6] mb-8 max-w-[750px] mx-auto">
            Bring your dream wedding look to life with custom outfits designed 
            around your fashion styles, perfect fit and special moments.
          </p>

          {/* Cyan Call to Action Button */}
          <Link
            href="/wedding"
            className="
              inline-flex 
              items-center 
              gap-2 
              bg-[#00c3ff] 
              hover:bg-[#00abe0] 
              text-white 
              font-bold 
              text-[15px] 
              px-8 
              py-3.5 
              rounded-full 
              transition-all 
              duration-300 
              shadow-md
              hover:shadow-lg
              hover:-translate-y-0.5
            "
          >
            Explore Now
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>

        </div>

        {/* Image Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {weddingImages.map((img) => (
            <div 
              key={img.id} 
              className="relative w-full aspect-square sm:aspect-[4/4.5] rounded-[32px] overflow-hidden shadow-lg group"
            >
              {img.src ? (
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className={`w-full h-full ${img.placeholderBg} flex items-center justify-center`}>
                  <span className="text-gray-600 font-bold tracking-widest bg-white/50 px-4 py-2 rounded-lg text-sm uppercase">
                    WEDDING IMAGE {img.id}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}