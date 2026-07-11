import Image from "next/image";

export default function WeddingInspiration() {
  const bgImageSrc = "/images/collection1.png";

  return (
    <section className="relative w-full h-[55vh] min-h-[450px]">
      <div className="absolute inset-0 w-full h-full z-0">
        {bgImageSrc && (
          <Image
            src={bgImageSrc}
            alt="Wedding Inspiration"
            fill
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="absolute inset-0 flex items-end justify-center pb-16 px-6 z-20">
        <h2 className="text-2xl sm:text-3xl md:text-[34px] font-bold text-white text-center max-w-[900px] leading-[1.3] drop-shadow-lg">
          Inspired by timeless traditions, crafted for moments that become lifelong memories.
        </h2>
      </div>
    </section>
  );
}
