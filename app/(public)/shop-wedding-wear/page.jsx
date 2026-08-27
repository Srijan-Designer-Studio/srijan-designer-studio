export const dynamic = 'force-dynamic';

import Script from "next/script";
import { createAdminClient } from '@/lib/supabase/admin';
import ScrollToTop from "@/components/providers/ScrollToTop";
import CategoryClient from "@/components/product/CategoryClient";

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
    .select(`id, slug, title, base_price, sale_price, gender, product_type, collections, product_images(image_url)`)
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
    <main className="py-20 bg-white min-h-screen pt-[100px] lg:pt-[120px]">
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
      <CategoryClient 
        products={products} 
        pageTitle={pageTitle} 
        emptyMessage={`No ${genderQuery ? genderQuery : 'bridal'} wear products found.`} 
      />
    </main>
  );
}