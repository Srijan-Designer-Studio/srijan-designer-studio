export const dynamic = 'force-dynamic';

import Script from "next/script";
import { createAdminClient } from '@/lib/supabase/admin';
import ScrollToTop from "@/components/providers/ScrollToTop";
import CategoryClient from "@/components/product/CategoryClient";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const gender = params?.gender?.toLowerCase();
  
  let title = "Shop Western Wear | Stylish Fashion for Men & Women";
  let description = "Shop western wear for men & women featuring trendy outfits, modern styles & premium designs. Find fashion for casual days, parties & special occasions.";
  let url = "https://srijandesignerstudio.com/shop-western-wear";

  if (gender === 'women') {
    title = "Shop Western Wear for Women | Trendy Modern Styles";
    description = "Shop western wear for women featuring trendy dresses, tops, blazers & stylish outfits. Discover premium designs for casual days, parties & special occasions.";
    url = "https://srijandesignerstudio.com/shop-western-wear-for-women";
  } else if (gender === 'men') {
    title = "Shop Western Wear for Men | Stylish Modern Outfits";
    description = "Shop western wear for men with stylish shirts, jackets, trousers & modern outfits. Discover premium designs for casual days, parties & special occasions.";
    url = "https://srijandesignerstudio.com/shop-western-wear-for-men";
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

export default async function WesternWearPage({ searchParams }) {
  const params = await searchParams;
  const genderQuery = params?.gender?.toLowerCase();
  const supabase = createAdminClient();

  const { data: allProducts } = await supabase
    .from('products')
    .select(`id, slug, title, base_price, sale_price, gender, collections, product_images(image_url)`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  let products = (allProducts || []).filter((product) => {
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    return dbCollections.includes("western wear");
  });

  let breadcrumbList = [];

  if (genderQuery === 'men') {
    breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
      { "@type": "ListItem", "position": 2, "name": "For Men", "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-men-online" },
      { "@type": "ListItem", "position": 3, "name": "Shop Western Wear for Men", "item": "https://srijandesignerstudio.com/shop-western-wear-for-men" }
    ];
    products = products.filter(product => {
      const dbGender = String(product.gender || "").toLowerCase();
      const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
      return dbGender === genderQuery || dbCollections.includes(genderQuery);
    });
  } else if (genderQuery === 'women') {
    breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
      { "@type": "ListItem", "position": 2, "name": "For Women", "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-women-online" },
      { "@type": "ListItem", "position": 3, "name": "Shop Western Wear for Women", "item": "https://srijandesignerstudio.com/shop-western-wear-for-women" }
    ];
    products = products.filter(product => {
      const dbGender = String(product.gender || "").toLowerCase();
      const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
      return dbGender === genderQuery || dbCollections.includes(genderQuery);
    });
  } else {
    breadcrumbList = [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
      { "@type": "ListItem", "position": 2, "name": "Shop Western Wear", "item": "https://srijandesignerstudio.com/shop-western-wear" }
    ];
  }

  const pageTitle = genderQuery === 'men' ? "Shop Western Wear for Men" 
                  : genderQuery === 'women' ? "Shop Western Wear for Women" 
                  : "Shop Western Wear";

  return (
    <main className="py-20 bg-white min-h-screen pt-[100px] lg:pt-[120px]">
      <Script
        id="western-breadcrumb"
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
      <CategoryClient 
        products={products} 
        pageTitle={pageTitle} 
        emptyMessage={`No ${genderQuery ? genderQuery : 'western wear'} products found.`} 
      />
    </main>
  );
}