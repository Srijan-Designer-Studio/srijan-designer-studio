import Image from "next/image";

export default function BridalHeroBanner() {
  return (
    <section className="relative w-full h-[85vh] sm:h-screen flex items-center overflow-hidden">
      {/* Next.js Optimized Background Image */}
      <Image
        src="/images/bidalinquery.png"
        alt="Bridal Banner"
        fill
        priority
        className="object-cover object-center -z-10"
      />

      {/* Semi-transparent dark overlay to ensure text contrast and readability */}
      <div className="absolute inset-0 bg-black/15 z-0"></div>

      {/* Typography and Hero Content Layout */}
      <div className="relative z-10 container mx-auto px-6 sm:px-12 md:px-24 text-white max-w-xl md:max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-wide uppercase leading-tight font-light drop-shadow-md">
          Made For Your <br />
          <span className="font-normal">Most Beautiful Day</span>
        </h1>
        
        <p className="mt-4 text-xl sm:text-2xl md:text-3xl font-serif italic font-light text-gray-100 drop-shadow-sm">
          Custom bridal wear, <br />
          crafted with love
        </p>
      </div>
    </section>
  );
}