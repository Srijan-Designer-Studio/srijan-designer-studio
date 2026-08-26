export const dynamic = 'force-dynamic';

import Script from 'next/script';
import MenHero from "@/components/men/MenHero";
import ShopSection from "@/components/shared/ShopSection";
import MenDescription from "@/components/men/MenDescription";
import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "Buy Designer Outfits for Men Online | SRIJAN Fashion",
  description: "Shop stylish outfits for men at SRIJAN Fashion. Discover trendy men wear and versatile men outfits for every occasion. Buy online with comfort and ease.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/buy-designer-outfits-for-men-online',
  },
  openGraph: {
    title: 'Buy Designer Outfits for Men Online | SRIJAN Fashion',
    description: 'Shop stylish outfits for men at SRIJAN Fashion. Discover trendy men wear and versatile men outfits for every occasion. Buy online with comfort and ease.',
    url: 'https://www.srijandesignerstudio.com/buy-designer-outfits-for-men-online',
    siteName: 'Srijan Fashion',
    images: [{ url: '/images/logo3.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function MenPage() {
  const allProducts = await getProducts() || [];

  const menEthnicProducts = allProducts.filter((product) => {
    const gender = String(product.gender || "").toLowerCase();
    const dbCategories = JSON.stringify(product.categories || []).toLowerCase();
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    
    return (gender === 'men' || gender === 'unisex') && 
           (dbCategories.includes('ethnic wear') || dbCollections.includes('ethnic wear'));
  });

  const menWesternProducts = allProducts.filter((product) => {
    const gender = String(product.gender || "").toLowerCase();
    const dbCategories = JSON.stringify(product.categories || []).toLowerCase();
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    
    return (gender === 'men' || gender === 'unisex') && 
           (dbCategories.includes('western wear') || dbCollections.includes('western wear'));
  });

  return (
    <main>
      <Script
        id="men-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/", 
            "@type": "BreadcrumbList", 
            "itemListElement": [{
              "@type": "ListItem", 
              "position": 1, 
              "name": "Home",
              "item": "https://srijandesignerstudio.com"  
            },{
              "@type": "ListItem", 
              "position": 2, 
              "name": "For Men",
              "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-men-online"  
            }]
          })
        }}
      />
      <MenHero />
      
      <ShopSection 
        title="Shop Ethnic Wear" 
        viewAllLink="/shop-ethnic-wear?gender=men"
        products={menEthnicProducts}
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        viewAllLink="/shop-western-wear?gender=men"
        products={menWesternProducts}
      />
      
      <MenDescription />
    </main>
  );
}