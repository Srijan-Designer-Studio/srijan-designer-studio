import Image from "next/image";

export default function BlogHero() {
  return (
    <section className="w-full h-screen">
      <Image
        src="/images/banner.png"
        alt="Our Blogs"
        fill
        className="object-cover object-top object-center"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1320px] w-full mx-auto px-6">
          <div className="max-w-xl text-white mt-10">
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold mb-4 leading-tight font-serif">
              Our Blogs
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed">
              Stay updated with the latest fashion styles, styling guides and trend insights to help you look your best every day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
