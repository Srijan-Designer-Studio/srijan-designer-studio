import Image from "next/image";

export default function About() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-r from-white to-[#eef2f6]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-10 items-center">
          
          {/* Left Side: Overlapping Image Areas */}
          <div className="relative w-full flex justify-center lg:justify-end lg:pr-16">
            
            {/* Main/Back Image Box (আপাতত কালার দেওয়া আছে) */}
            <div className="relative w-[320px] sm:w-[400px] h-[450px] sm:h-[550px] rounded-3xl overflow-hidden shadow-lg bg-[#eab308] flex items-center justify-center">              

              
            
                
                <Image
                  src="/images/collection1.png"
                  alt="Main About Image"
                  fill
                  className="object-cover"
                /> 
             
            </div>

            
            <div className="absolute top-1/2 -translate-y-1/2 -left-2 sm:left-4 lg:-left-4 w-[240px] sm:w-[300px] h-[260px] sm:h-[320px] rounded-3xl overflow-hidden shadow-2xl bg-[#2dd4bf] border-[6px] border-white flex items-center justify-center">
              
            

             
                
                <Image
                  src="/images/collection2.png"
                  alt="Overlay About Image"
                  fill
                  className="bg-center bg-cover"
                /> 
              
            </div>

          </div>

          {/* Right Side: Text Content */}
          <div className="max-w-[550px] mt-10 lg:mt-0">
            {/* Subheading */}
            <span className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-4 block">
              ABOUT US
            </span>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-[46px] font-bold text-[#111] leading-[1.2] mb-6">
              Fashion Made for Every Style
            </h2>

            {/* Description */}
            <p className="text-lg sm:text-[19px] text-[#444] leading-relaxed">
              At <strong className="text-black font-bold">SRIJAN Fashion</strong>, we believe every
              outfit should reflect your personality. From everyday wear to special
              occasions, our online shopping experience makes it easy to discover
              beautiful designs. Explore the latest fashion styles or create a custom
              outfit made just for you.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}