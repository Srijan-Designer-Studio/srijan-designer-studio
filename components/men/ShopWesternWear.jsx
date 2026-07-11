import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const productsData = [
  {
    id: 1,
    title: "Srijan Fashion Designer Checked French Long Coat for Men",
    price: "₹9,999",
    imageSrc: "/images/man6.png", 
  },
  {
    id: 2,
    title: "Srijan Fashion Stylish Clock Printed Men's Blazer",
    price: "₹5,799",
    imageSrc: "/images/man7.png",
  },
  {
    id: 3,
    title: "Srijan Fashion Modern Mens Formal Blazer",
    price: "₹6,299",
    imageSrc: "/images/man8.png",
  },
  {
    id: 4,
    title: "Srijan Fashion Modern Floral Printed Men Blazer",
    price: "₹5,499",
    imageSrc: "/images/man9.png",
  }
];

export default function ShopWesternWear() {
  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-[1320px] mx-auto px-6">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-[#111]">
            Shop Western Wear
          </h2>
          
          <Link 
            href="/men/western-wear" 
            className="flex items-center text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            View All
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {productsData.map((product) => (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id}
              className="group flex flex-col items-center cursor-pointer"
            >
              
              <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-400 overflow-hidden mb-4 bg-white transition-shadow duration-300 group-hover:shadow-xl">
                {product.imageSrc && (
                  <Image
                    src={product.imageSrc}
                    alt={product.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>

              <h3 className="text-[12px] sm:text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-3">
                {product.title}
              </h3>

              <p className="text-[13px] sm:text-[14px] font-bold text-black text-center">
                {product.price}
              </p>
              
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}