export const dynamic = 'force-dynamic';

import Script from "next/script";
import { createAdminClient } from '@/lib/supabase/admin';
import ScrollToTop from "@/components/providers/ScrollToTop";
import CategoryClient from "@/components/product/CategoryClient";

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
    .select(`id, slug, title, base_price, sale_price, gender, collections, product_images(image_url)`)
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
      { "@type": "ListItem", "position": 2, "name": "For Women", "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-women-online" },
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
    <main className="py-20 bg-white min-h-screen pt-[100px] lg:pt-[120px]">
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
      <CategoryClient 
        products={products} 
        pageTitle={pageTitle} 
        emptyMessage={`No ${genderQuery ? genderQuery : 'ethnic wear'} products found.`} 
      />
    </main>
  );
}