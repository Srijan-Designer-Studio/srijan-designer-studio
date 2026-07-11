import Image from "next/image";

// Data array for the services list to keep the JSX clean
const servicesData = [
  {
    title: "For The Trendsetters (Ready-to-Wear):",
    description: "From breezy Western cuts for your brunch dates to elegant Indo-Western fusions for office parties, and timeless Ethnic wear for family gatherings our racks are curated for the modern woman who refuses to be boring."
  },
  {
    title: "For The Dreamers (Bridal & Custom):",
    description: "Your wedding dress shouldn't just fit your body; it should fit your personality. Our specialized Bridal Section works with you thread by thread to craft a trousseau that is uniquely yours. Have a specific design in mind? Our \"Scratch-to-Reality\" Customization Service guarantees that if you can dream it, we can stitch it."
  },
  {
    title: "For The Little Ones (Kids Section):",
    description: "Why should adults have all the fun? We craft comfortable, stylish, and adorable outfits for kids. Whether it's a birthday princess gown or a festive kurta for your little prince, we make sure they steal the show (comfortably)."
  },
  {
    title: "For The Visionaries (Production Hub):",
    description: "We are makers at heart. Beyond our own label, Srijan serves as a Production Powerhouse for other brands. We offer end-to-end manufacturing services, handling bulk production with the same precision and quality control we apply to our individual masterpieces. You design the brand; we handle the sewing machines."
  }
];

export default function WhatWeDo() {
  
  const imageSrc = "/images/aboutmodel.png"; 

  return (
    <section className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: Image Container */}
          <div className="w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-hidden bg-[#f0f4f8]">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt="Srijan Fashion Mannequin"
                  fill
                  className="object-contain p-4" 
                />
              ) : (
                // Light grey-blue placeholder matching the image's backdrop
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-gray-500 font-bold tracking-widest bg-white/60 px-4 py-2 rounded-lg text-sm uppercase">
                    WHAT WE DO IMAGE
                  </span>
                  <p className="text-gray-400 text-xs mt-4">
                    Place a transparent PNG of the mannequin here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="max-w-[650px]">
            
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#111] leading-tight mb-6">
              What We Do
            </h2>

            {/* Subtitle */}
            <p className="text-[17px] text-gray-800 leading-relaxed mb-8">
              We are not just a boutique; we are a full-spectrum fashion hub.
            </p>

            {/* Bulleted List */}
            <ul className="space-y-6 list-disc pl-5 marker:text-black">
              {servicesData.map((service, index) => (
                <li key={index} className="pl-2">
                  <p className="text-[16px] lg:text-[17px] leading-[1.65] text-gray-800">
                    <strong className="font-bold text-black">
                      {service.title}
                    </strong>{" "}
                    {service.description}
                  </p>
                </li>
              ))}
            </ul>

          </div>

        </div>
      </div>
    </section>
  );
}