import Image from "next/image";

export default function CustomizeHero() {
  return (
    <section className=" w-full h-screen min-h-[400px]">
      <Image
        src="/images/man1.png"
        alt="Create Your Own Designer Dress"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Create Your Own<br />Designer Dress
            </h1>
            <p className="text-lg md:text-xl font-medium">
              Design a one of a kind outfit with our custom dresses service. Made to match your style, your fit and your vision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
