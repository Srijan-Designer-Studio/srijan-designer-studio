export const dynamic = 'force-dynamic';

import Script from 'next/script';
import WomenHero from "@/components/women/WomenHero";
import ShopSection from "@/components/shared/ShopSection";
import WomenDescription from "@/components/women/WomenDescription";
import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "Buy Designer Outfits for Women Online | SRIJAN Fashion",
  description: "Shop stylish outfits for women at SRIJAN Fashion. Explore designer outfits & premium women wear perfect for every occasion. Buy online with ease today.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/buy-designer-outfits-for-women-online',
  },
  openGraph: {
    title: 'Buy Designer Outfits for Women Online | SRIJAN Fashion',
    description: 'Shop stylish outfits for women at SRIJAN Fashion. Explore designer outfits & premium women wear perfect for every occasion. Buy online with ease today.',
    url: 'https://www.srijandesignerstudio.com/buy-designer-outfits-for-women-online',
    siteName: 'Srijan Fashion',
    images: [{ url: '/images/logo3.jpg', width: 1200, height: 630 }],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function WomenPage() {
  const allProducts = await getProducts() || [];

  const womenEthnicProducts = allProducts.filter((product) => {
    const gender = String(product.gender || "").toLowerCase();
    const dbCategories = JSON.stringify(product.categories || []).toLowerCase();
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    
    return (gender === 'women' || gender === 'unisex') && 
           (dbCategories.includes('ethnic wear') || dbCollections.includes('ethnic wear'));
  });

  const womenWesternProducts = allProducts.filter((product) => {
    const gender = String(product.gender || "").toLowerCase();
    const dbCategories = JSON.stringify(product.categories || []).toLowerCase();
    const dbCollections = JSON.stringify(product.collections || []).toLowerCase();
    
    return (gender === 'women' || gender === 'unisex') && 
           (dbCategories.includes('western wear') || dbCollections.includes('western wear'));
  });

  return (
    <main>
      <Script
        id="women-breadcrumb"
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
              "name": "For Women",
              "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-women-online"  
            }]
          })
        }}
      />
      <WomenHero />
      
      <ShopSection 
        title="Shop Ethnic Wear" 
        viewAllLink="/shop-ethnic-wear?gender=women" 
        products={womenEthnicProducts} 
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        viewAllLink="/shop-western-wear?gender=women" 
        products={womenWesternProducts} 
      />
      
      <WomenDescription />
    </main>
  );
}