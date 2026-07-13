import Image from "next/image";

export default function ContactHero() {
  return (
    <section className=" w-full h-screen min-h-[400px]">
      <Image
        src="/images/man1.png"
        alt="Connect with Srijan Fashion"
        fill
        className="object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="text-white drop-shadow-md">
            <p className="text-xl md:text-2xl font-bold mb-2">Let's</p>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-tight font-serif">
              Connect<br />with SRIJAN Fashion
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}