import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const weddingProducts = [
  { id: 1, imageSrc: "/images/collection1.png" },
  { id: 2, imageSrc: "/images/collection2.png" },
  { id: 3, imageSrc: "/images/collection3.png" },
];

export default function WeddingCollection() {
  return (
    <section className="py-20 bg-[#f4f5f8]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 leading-tight">
              Crafted for Your <br className="hidden lg:block" /> Special Day
            </h2>
            <p className="text-[#333] text-[16px] leading-relaxed mb-8">
              Every wedding dress is crafted with care, comfort and timeless style.
            </p>
            <Link
              href="/wedding"
              className="inline-flex items-center gap-3 text-[#1070c0] font-bold text-[14px] uppercase tracking-wide transition-opacity hover:opacity-80"
            >
              SHOP OUR COLLECTION
              <ArrowRight size={22} strokeWidth={2.5} className="text-black" />
            </Link>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {weddingProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative w-full aspect-[3/4] bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {product.imageSrc && (
                    <Image
                      src={product.imageSrc}
                      alt="Wedding Dress"
                      fill
                      className="object-cover object-top"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
