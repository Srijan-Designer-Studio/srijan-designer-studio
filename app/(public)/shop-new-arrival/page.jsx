export const dynamic = 'force-dynamic';

import Script from "next/script";
import { createAdminClient } from '@/lib/supabase/admin';
import NewArrivalsGrid from './NewArrivalsGrid';
import ScrollToTop from '@/components/providers/ScrollToTop';

export const metadata = {
  title: "Shop New Arrival | Latest Fashion for Everyone",
  description: "Shop new arrival fashion for men & women. Discover the latest styles, fresh designs & premium outfits made to elevate your everyday & special occasion look.",
  alternates: {
    canonical: 'https://srijandesignerstudio.com/shop-new-arrival',
  },
  openGraph: {
    title: 'Shop New Arrival | Latest Fashion for Everyone',
    description: 'Shop new arrival fashion for men & women. Discover the latest styles, fresh designs & premium outfits made to elevate your everyday & special occasion look.',
    url: 'https://srijandesignerstudio.com/shop-new-arrival',
    siteName: 'Srijan Fashion',
    images: [{ url: '/images/logo3.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function NewArrivalsPage() {
  const supabase = createAdminClient();

  const { data: allProducts } = await supabase
    .from('products')
    .select(`id, slug, title, base_price, sale_price, collections, product_images(image_url)`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  let products = (allProducts || []).filter((product) => {
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    return dbCollections.includes("new arrivals");
  });

  const breadcrumbList = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.srijandesignerstudio.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shop New Arrival", "item": "https://srijandesignerstudio.com/shop-new-arrival" }
  ];

  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 bg-white min-h-screen relative">
      <Script
        id="newarrival-breadcrumb"
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
      <NewArrivalsGrid products={products || []} />
    </main>
  );
}