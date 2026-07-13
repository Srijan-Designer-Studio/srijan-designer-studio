import Image from "next/image";

export default function KidsMemory() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="w-full lg:w-1/2 relative flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-square">
            <Image
              src="/images/camera-frame.png"
              alt="Memory Camera"
              fill
              className="object-contain"
            />
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-black mb-6 font-serif leading-tight">
            Make Every Click a<br />Memory to Keep
          </h2>
          <p className="text-gray-700 text-[15px] md:text-base leading-relaxed">
            Some moments happen only once and every click should bring back a happy memory. At <strong>SRIJAN Fashion</strong>, we help you customize kids wear that feels personal and looks beautiful. Whether it's a birthday, festival, family function or photoshoot, we create outfits that fit your child perfectly and make every picture even more special.
          </p>
        </div>
      </div>
    </section>
  );
}
