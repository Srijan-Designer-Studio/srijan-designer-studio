export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { createAdminClient } from '@/lib/supabase/admin';
import ScrollToTop from "@/components/providers/ScrollToTop";

export const metadata = {
  title: "Shop Our Wedding Wear Collection | Designer Wedding Dresses",
  description: "Shop wedding wear for elegant celebrations. Explore designer wedding dresses made with beautiful details, premium fabrics & timeless styles for every occasion.",
  alternates: {
    canonical: 'https://srijandesignerstudio.com/shop-wedding-wear',
  },
  openGraph: {
    title: 'Shop Our Wedding Wear Collection | Designer Wedding Dresses',
    description: 'Shop wedding wear for elegant celebrations. Explore designer wedding dresses made with beautiful details, premium fabrics & timeless styles for every occasion.',
    url: 'https://srijandesignerstudio.com/shop-wedding-wear',
    siteName: 'Srijan Fashion',
    images: [{ url: '/images/logo3.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function WeddingPage({ searchParams }) {
  const params = await searchParams;
  const genderQuery = params?.gender?.toLowerCase();
  const supabase = createAdminClient();

  const { data: allProducts } = await supabase
    .from('products')
    .select(`id, slug, title, base_price, gender, product_type, collections, product_images(image_url)`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  let products = (allProducts || []).filter((product) => {
    const dbType = String(product.product_type || "").toLowerCase();
    const dbCollection = JSON.stringify(product.collections || "").toLowerCase();
    const dbTitle = String(product.title || "").toLowerCase();
    return dbType.includes("wedding") || dbCollection.includes("wedding") || dbTitle.includes("wedding");
  });

  if (genderQuery) {
    products = products.filter(product => {
      const dbGender = String(product.gender || "").toLowerCase();
      const dbCollectionName = JSON.stringify(product.collections || "").toLowerCase();
      return dbGender === genderQuery || dbCollectionName.includes(genderQuery);
    });
  }

  const breadcrumbList = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
    { "@type": "ListItem", "position": 2, "name": "Custom Wedding Wear", "item": "https://www.srijandesignerstudio.com/create-custom-wedding-wear" },
    { "@type": "ListItem", "position": 3, "name": "Shop Wedding Wear", "item": "https://srijandesignerstudio.com/shop-wedding-wear" }
  ];

  const pageTitle = genderQuery === 'men' ? "Men's Wedding Collection" 
                  : genderQuery === 'women' ? "Women's Wedding Collection" 
                  : "Shop Our Wedding Wear Collection";

  return (
    <main className="py-20 bg-white min-h-screen">
      <Script
        id="wedding-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/", 
            "@type": "BreadcrumbList", 
            "itemListElement": breadcrumbList
          })
        }}
      />
      <ScrollToTop />
      <div className="max-w-[1320px] mx-auto px-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide">
          {pageTitle}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.length > 0 ? (
            products.map((product) => {
              const imageUrl = product.product_images?.[0]?.image_url;
              return (
                <Link href={`/product/${product.slug || product.id}`} key={product.id} className="group flex flex-col items-center cursor-pointer">
                  <div className="relative w-full aspect-[3/4] rounded-[16px] border border-gray-300 overflow-hidden mb-4 bg-gray-50 transition-shadow duration-300 group-hover:shadow-xl">
                    {imageUrl ? (
                      <img src={imageUrl} alt={product.title} className="object-cover object-top w-full h-full transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">NO IMAGE</div>
                    )}
                  </div>
                  <h3 className="text-[15px] font-semibold text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 transition-colors group-hover:text-[#00c3ff]">
                    {product.title}
                  </h3>
                  <p className="text-[19px] font-bold text-black text-center">₹{product.base_price?.toLocaleString('en-IN')}</p>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">No {genderQuery ? genderQuery : 'bridal'} wear products found.</div>
          )}
        </div>
      </div>
    </main>
  );
}