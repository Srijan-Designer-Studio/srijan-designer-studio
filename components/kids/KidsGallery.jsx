import Image from "next/image";
import Link from "next/link";
import { allProducts } from "@/data/products";

export default function KidsGallery() {
  const galleryItems = allProducts.slice(0, 10).map((prod, i) => ({
    ...prod,
    styleClass: 
      i === 0 ? "col-span-1 row-span-1" :
      i === 1 ? "col-span-1 row-span-1" :
      i === 2 ? "col-span-2 row-span-2 hidden md:block" :
      i === 3 ? "col-span-2 row-span-2 hidden lg:block" :
      i === 4 ? "col-span-1 row-span-1" :
      i === 5 ? "col-span-1 row-span-1" :
      "col-span-1 row-span-1" 
  }));

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">Our Click Gallery</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
          {galleryItems.map((item, idx) => (
            <Link 
              href={`/product/${item.id}`} 
              key={idx} 
              className={`relative rounded-xl overflow-hidden bg-gray-100 group ${item.styleClass}`}
            >
              {item.image && (
                <Image 
                  src={item.image} 
                  alt="Gallery image" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
