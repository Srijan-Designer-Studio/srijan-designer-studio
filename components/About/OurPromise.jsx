import Image from "next/image";

// Data array for the promises list to keep the JSX clean and maintainable
const promisesData = [
  {
    title: "No Compromises:",
    description: "We use premium fabrics and expert tailoring."
  },
  {
    title: "No Limits:",
    description: "Any size, any style, any design."
  },
  {
    title: "No Delays:",
    description: "Whether it’s a single bridal lehenga or a bulk order of 500 units, we respect the deadline."
  }
];

export default function OurPromise() {
 
  const imageSrc = "/images/aboutmodel.png"; 

  return (
    
    <section className="py-20 lg:py-32 bg-white border-b-[12px] border-[#1a1b41]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Text Content */}
          <div className="max-w-[600px]">
            
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-6">
              Our Promise
            </h2>

            {/* Intro Paragraph */}
            <p className="text-[17px] text-gray-800 leading-relaxed mb-6">
              In a world of fast fashion and copy-paste trends, 
              SRIJAN stands for individuality.
            </p>

            {/* Bulleted List */}
            <ul className="space-y-4 list-disc pl-5 marker:text-black mb-8">
              {promisesData.map((item, index) => (
                <li key={index} className="pl-2">
                  <p className="text-[16px] lg:text-[17px] leading-[1.65] text-gray-800">
                    <span className="text-black">
                      {item.title}
                    </span>{" "}
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>

            {/* Outro Paragraph */}
            <p className="text-[17px] text-gray-800 leading-relaxed">
              Welcome to SRIJAN. Come for the fashion. Stay for the fit.
            </p>
            
          </div>

          {/* Right Side: Image Container */}
          <div className="flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-[24px] overflow-hidden shadow-lg">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Srijan Fashion Promise"
                  fill
                  className="object-cover" 
                />
              ) : (
                // Purple-grey gradient placeholder matching the image's background
                <div className="w-full h-full bg-gradient-to-b from-[#6b6985] to-[#b3b2c2] flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-white/80 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-sm uppercase">
                    PROMISE IMAGE
                  </span>
                  <p className="text-white/60 text-xs mt-4">
                    Place a transparent PNG of the mannequin here.
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