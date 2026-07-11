import Image from "next/image";
import Link from "next/link";

// Base product data extracted from the design
const baseProducts = [
  
  
  {
    title: "Srijan Fashion Georgette Saree and Designer Blouse Set",
    price: "₹9,500",
    imageSrc: "/images/collection1.png", 
  },
  {
    title: "Srijan Fashion Embroidered Bridal Lehenga for Reception",
    price: "₹85,000",
    imageSrc: "/images/collection2.png",
  },
  {
    title: "Srijan Fashion Heavy Embroidered Raw Silk Bridal Lehenga",
    price: "₹170,000",
    imageSrc: "/images/collection3.png",
  },
  {
    title: "Srijan Fashion Designer Brocade Off Shoulder Corset Top",
    price: "₹3,200",
    imageSrc: "/images/collection4.png",
  }
];

// Duplicating the array to create the 12 items shown in your image
const productsData = [...baseProducts, ...baseProducts, ...baseProducts].map(
  (product, index) => ({
    ...product,
    id: index + 1,
  })
);

export default function ShopStyles() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-6">
        
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#111] mb-10">
          Shop Styles
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
          {productsData.map((product) => (
            <Link 
              href={`/product/${product.id}`} 
              key={product.id}
              className="group flex flex-col items-center cursor-pointer"
            >
              
              {/* Product Image Container */}
              <div className="relative w-full aspect-[3/4] rounded-2xl border border-gray-300 overflow-hidden mb-4 bg-white transition-shadow duration-300 group-hover:shadow-lg">
                
                  <Image
                    src={product.imageSrc}
                    alt={product.title}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                
              </div>

              {/* Product Title */}
              <h3 className="text-[12px] sm:text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2">
                {product.title}
              </h3>

              {/* Product Price */}
              <p className="text-[13px] sm:text-[14px] font-bold text-black text-center">
                {product.price}
              </p>
              
            </Link>
          ))}
        </div>

        {/* Bottom Pagination / Slider Indicators */}
        <div className="flex items-center justify-center gap-2 mt-12">
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer"></span>
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer"></span>
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer"></span>
          <span className="w-8 h-[3px] bg-[#00c3ff] rounded-full cursor-pointer"></span>
        </div>

      </div>
    </section>
  );
}