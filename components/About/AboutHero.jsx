import Image from "next/image";

export default function AboutHero() {
  // Add your background image path here later, e.g., "/images/about-hero-bg.png"
  const bgImageSrc = "/images/about.png"; 

  return (
    // Negative margin to pull the hero section under the transparent header
    <section className="relative w-full h-screen min-h-[600px] -mt-[90px]">
      
      {/* Background Image or Placeholder */}
      <div className="absolute inset-0 w-full h-full z-0">
        {bgImageSrc ? (
          <Image
            src={bgImageSrc}
            alt="About Srijan Fashion"
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          // Temporary placeholder background color (Gray gradient to mimic the image)
          <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 flex items-center justify-center">
             <span className="text-white/50 font-bold tracking-widest px-4 py-2 text-sm uppercase">
                HERO BACKGROUND IMAGE
             </span>
          </div>
        )}
      </div>

      {/* Dark Overlay to make the white text readable */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Text Content Container */}
      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        
        {/* Margin top added to push the text down, preventing it from hiding behind the header */}
        <div className="max-w-[700px] mt-[90px]">
          
          {/* Main Heading (Serif Font to match the design) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Where Every Design Begins with Your Vision
          </h1>

          {/* Subheading / Description Paragraph */}
          <p className="text-lg sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">
            At Srijan Fashion, we create designer outfits and custom designs that 
            celebrate your unique style and personality.
          </p>

        </div>
      </div>
      
    </section>
  );
}

