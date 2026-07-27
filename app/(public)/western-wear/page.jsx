export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: "Western Wear | SRIJAN Fashion",
  description: "Shop the latest trends in western wear.",
};

export default async function WesternWearPage() {
  const supabase = await createClient();

  const { data: westernProducts } = await supabase
    .from('products')
    .select(`
      id,
      title,
      base_price,
      product_images(image_url)
    `)
    .eq('product_type', 'Western Wear')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const products = westernProducts || [];

  return (
    <main className="py-20 bg-white min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6">
        
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide">
          Western Wear Collection
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = product.product_images?.[0]?.image_url;

              return (
                <Link 
                  href={`/product/${product.id}`} 
                  key={product.id} 
                  className="group flex flex-col items-center cursor-pointer"
                >
                  <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                    {imageUrl ? (
                      <Image 
                        src={imageUrl} 
                        alt={product.title} 
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">NO IMAGE</div>
                    )}
                  </div>
                  
                  <h3 className="text-[13px] text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 transition-colors group-hover:text-[#00c3ff]">
                    {product.title}
                  </h3>
                  
                  <p className="text-[14px] font-bold text-black text-center">
                    ₹{product.base_price?.toLocaleString('en-IN')}
                  </p>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
               No western wear products found.
            </div>
          )}
        </div>

      </div>
    </main>
  );
}