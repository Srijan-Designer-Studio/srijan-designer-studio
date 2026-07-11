import Image from "next/image";

export default function WomenHero() {
  
  const bgImageSrc = "/images/banner2.png"; 

  return (
    
    <section className="relative w-full h-[65vh] min-h-[600px] -mt-[90px]">
      
      
      <div className="absolute inset-0 w-full h-full z-0">
      
          <Image
            src={bgImageSrc}
            alt="Shop Stylish Outfits for Women"
            fill
            priority
            className="object-cover object-center"
          />
        
      </div>

     
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      
      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        
        
        <div className="max-w-[700px] mt-[90px]">
          
         
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-bold text-white font-serif leading-[1.1] mb-6 drop-shadow-md">
            Shop Stylish Outfits <br className="hidden sm:block" />
            for Women
          </h1>

         
          <p className="text-lg sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[550px]">
            Discover elegant designer outfits and trendy women wear crafted 
            to match your style, comfort and every occasion.
          </p>

        </div>
      </div>
      
    </section>
  );
}