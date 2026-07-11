import Image from "next/image";

export default function WeddingHero() {
  const bgImageSrc = "/images/banner2.png";

  return (
    <section className="relative w-full h-screen -mt-[90px]">
      <div className="absolute inset-0 w-full h-full z-0">
        {bgImageSrc && (
          <Image
            src={bgImageSrc}
            alt="Wedding Edit"
            fill
            priority
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      <div className="absolute inset-0 flex items-center justify-start max-w-[1320px] mx-auto px-6 w-full z-20">
        <div className="max-w-[600px] mt-[90px]">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-md">
            Wedding Edit
          </h1>
          <p className="text-lg sm:text-xl text-white font-semibold leading-relaxed drop-shadow-sm">
            Find the wedding wear that feels right for your big day or create a custom look that's truly yours.
          </p>
        </div>
      </div>
    </section>
  );
}
