import Image from "next/image";
import Link from "next/link";
import { allProducts } from '@/data/products';

export const metadata = {
  title: "Western Wear | SRIJAN Fashion",
  description: "Shop the latest trends in western wear.",
};

export default function WesternWearPage() {
  
  const westernProducts = allProducts.filter(
    (product) => product.category.includes("Western")
  );

  return (
    <main className="py-20 bg-white min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6">
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide">
          Western Wear Collection
        </h1>
        
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {westernProducts.map((product) => (
             <Link href={`/product/${product.id}`} key={product.id} className="group flex flex-col items-center cursor-pointer">
              <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                {product.image && (
                  <Image src={product.image} alt={product.title} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                )}
              </div>
              <h3 className="text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 transition-colors group-hover:text-[#00c3ff]">
                {product.title}
              </h3>
              <p className="text-[14px] font-bold text-black text-center">{product.price}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}