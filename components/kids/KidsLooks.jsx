import Image from "next/image";
import Link from "next/link";
import { allProducts } from "@/data/products";

export default function KidsLooks() {
  const getProduct = (index) => allProducts[index % allProducts.length];

  const looks = [
    { id: 1, title: "Party Perfect Clicks", prod: getProduct(0) },
    { id: 2, title: "Everyday Happy Clicks", prod: getProduct(1) },
    { id: 3, title: "Magical Theme Clicks", prod: getProduct(2) },
    { id: 4, title: "First Birthday Clicks", prod: getProduct(3) },
    { id: 5, title: "Picture-Perfect Gown Clicks", prod: getProduct(4) },
    { id: 6, title: "Festive Ethnic Clicks", prod: getProduct(5) },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12">Choose Click By Looks</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {looks.map((look) => (
            <Link 
              href={`/product/${look.prod.id}`} 
              key={look.id} 
              className="group flex flex-col items-center"
            >
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 mb-4 shadow-sm border border-gray-100">
                {look.prod.image && (
                  <Image 
                    src={look.prod.image} 
                    alt={look.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                )}
              </div>
              <h3 className="text-lg font-bold text-black group-hover:text-[#00c3ff] transition-colors">
                {look.title}
              </h3>
            </Link>
          ))}
        </div>

        <Link href="/product">
          <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3.5 px-10 rounded-full transition-colors shadow-md">
            Choose Your Look
          </button>
        </Link>
      </div>
    </section>
  );
}
