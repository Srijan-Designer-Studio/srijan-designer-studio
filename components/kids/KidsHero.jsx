import Image from "next/image";

export default function KidsHero() {
  return (
    <section className=" w-full h-screen min-h-[500px]">
      <Image
        src="/images/kids.png"
        alt="Customize Kids Wear"
        fill
        className="object-cover object-right md:object-center"
      />
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-lg md:ml-auto text-white">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold mb-4 leading-tight drop-shadow-md">
              Customize Kids<br />Wear
            </h1>
            <p className="text-lg md:text-xl font-medium drop-shadow-md">
              Click your kids every little special moments
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
