export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { createAdminClient } from '@/lib/supabase/admin';
import ScrollToTop from "@/components/providers/ScrollToTop";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const gender = params?.gender?.toLowerCase();
  
  let title = "Shop Ethnic Wear | Traditional Styles for Men & Women";
  let description = "Shop ethnic wear for men & women featuring elegant traditional outfits, premium fabrics & stylish designs for weddings, festivals & special occasions.";
  let url = "https://srijandesignerstudio.com/shop-ethnic-wear";

  if (gender === 'women') {
    title = "Shop Ethnic Wear for Women | Elegant Traditional Styles";
    description = "Shop ethnic wear for women featuring elegant traditional outfits, stylish designs & premium fabrics. Find beautiful styles for weddings, festivals & occasions.";
    url = "https://srijandesignerstudio.com/shop-ethnic-wear-for-women";
  } else if (gender === 'men') {
    title = "Shop Ethnic Wear for Men | Stylish Traditional Outfits";
    description = "Shop ethnic wear for men featuring stylish kurtas, traditional outfits & modern designs. Find premium styles for weddings, festivals & special occasions.";
    url = "https://srijandesignerstudio.com/shop-ethnic-wear-for-men";
  }

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Srijan Fashion',
      images: [{ url: '/images/logo3.jpg', width: 1200, height: 630 }],
      locale: 'en_IN',
      type: 'website',
    },
  };
}

export default async function EthnicWearPage({ searchParams }) {
  const params = await searchParams;
  const genderQuery = params?.gender?.toLowerCase();
  const supabase = createAdminClient();

  const { data: allProducts } = await supabase
    .from('products')
    .select(`id, slug, title, base_price, gender, collections, product_images(image_url)`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  let products = (allProducts || []).filter((product) => {
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    return dbCollections.includes("ethnic wear");
  });

  let breadcrumbList = [];

  if (genderQuery === 'men') {
    breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
      { "@type": "ListItem", "position": 2, "name": "For Men", "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-men-online" },
      { "@type": "ListItem", "position": 3, "name": "Shop Ethnic Wear for Men", "item": "https://srijandesignerstudio.com/shop-ethnic-wear-for-men" }
    ];
    products = products.filter(product => {
      const dbGender = String(product.gender || "").toLowerCase();
      const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
      return dbGender === genderQuery || dbCollections.includes(genderQuery);
    });
  } else if (genderQuery === 'women') {
    breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
      { "@type": "ListItem", "position": 2, "name": "For Women", "item": "https://srijandesignerstudio.com/buy-designer-outfits-for-women-online" },
      { "@type": "ListItem", "position": 3, "name": "Shop Ethnic Wear for Women", "item": "https://srijandesignerstudio.com/shop-ethnic-wear-for-women" }
    ];
    products = products.filter(product => {
      const dbGender = String(product.gender || "").toLowerCase();
      const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
      return dbGender === genderQuery || dbCollections.includes(genderQuery);
    });
  } else {
    breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
      { "@type": "ListItem", "position": 2, "name": "Shop Ethnic Wear", "item": "https://srijandesignerstudio.com/shop-ethnic-wear" }
    ];
  }

  const pageTitle = genderQuery === 'men' ? "Shop Ethnic Wear for Men" 
                  : genderQuery === 'women' ? "Shop Ethnic Wear for Women" 
                  : "Shop Ethnic Wear";

  return (
    <main className="py-20 bg-white min-h-screen">
      <Script
        id="ethnic-breadcrumb"
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
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide">
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
                      <img src={imageUrl} alt={product.title} className="object-cover object-top w-full h-full transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">NO IMAGE</div>
                    )}
                  </div>
                  <h3 className="text-[15px] font-semibold text-center text-gray-800 leading-[1.4] mb-1.5 px-2 line-clamp-2 group-hover:text-[#00c3ff]">
                    {product.title}
                  </h3>
                  <p className="text-[19px] font-bold text-black text-center">₹{product.base_price?.toLocaleString('en-IN')}</p>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">No {genderQuery ? genderQuery : 'ethnic wear'} products found.</div>
          )}
        </div>
      </div>
    </main>
  );
}