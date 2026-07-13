import Image from "next/image";

export default function ProductsHero() {
  // Add your background image path here later, e.g., "/images/products-hero-bg.png"
  const bgImageSrc = "/images/banner.png"; 

  return (
    // Negative margin to pull the hero section under the transparent header
    <section className="relative w-full h-screen min-h-[400px] -mt-[90px]">
      
      {/* Background Image or Placeholder */}
      <div className="absolute inset-0 w-full h-full z-0">
       
          <Image
            src={bgImageSrc}
            alt="Shop Srijan Fashion Collection"
            fill
            priority
            className="object-cover object-center"
          />
        
      </div>

      {/* Dark Overlay to make the white text readable against busy backgrounds */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>

      {/* Text Content Container */}
      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        
        {/* Margin top added to push the text down, preventing it from hiding behind the header */}
        <div className="max-w-[700px] mt-[90px]">
          
          {/* Main Heading (Serif Font to match the design) */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Shop Styles <br />
            From Our Latest <br />
            Collection
          </h1>

          {/* Subheading / Description Paragraph */}
          <p className="text-lg sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[550px]">
            Explore ethnic wear, western wear, bridal collections and more to 
            find the perfect look that matches your style.
          </p>

        </div>
      </div>
      
    </section>
  );
}