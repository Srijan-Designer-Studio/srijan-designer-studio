import Image from "next/image";

export default function AboutSrijan() {
  // Add your image path here later, e.g., "/images/srijan-mannequin.png"
  const imageSrc = "/images/aboutmodel.png"; 

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Text Content */}
          <div className="max-w-[600px]">
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-8">
              “SRIJAN” means Creation.
            </h2>

            {/* Paragraph 1 */}
            <p className="text-[17px] leading-[1.7] text-gray-800 mb-6">
              And that is exactly what we do. We don’t just sell clothes; we create 
              statements, memories and moments.
            </p>

            {/* Paragraph 2 */}
            <p className="text-[17px] leading-[1.7] text-gray-800 mb-6">
              At <strong className="font-bold text-black">SRIJAN Fashion</strong>, we believe 
              that fashion shouldn’t be limited by what’s on a rack. Whether it’s a 
              screenshot from Instagram, a sketch on a napkin or a dream you’ve had 
              since you were five we exist to bring it to life.
            </p>

            {/* Paragraph 3 */}
            <p className="text-[17px] leading-[1.7] text-gray-800">
              We are a new-age fashion house in Kolkata that bridges the gap between 
              exclusive designer luxury and accessible, custom fashion.
            </p>
          </div>

          {/* Right Side: Image Box */}
          <div className="flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[24px] overflow-hidden shadow-xl">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Srijan Fashion Creation"
                  fill
                  className="object-cover"
                />
              ) : (
                // Placeholder styling matching the purple-grey gradient from the design
                <div className="w-full h-full bg-gradient-to-b from-[#a4a5b9] to-[#45455e] flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-white/70 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-sm uppercase">
                    ABOUT IMAGE
                  </span>
                  <p className="text-white/50 text-xs mt-4">
                    Add a transparent PNG of the mannequin to achieve the exact design look.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}