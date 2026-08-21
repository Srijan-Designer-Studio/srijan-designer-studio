export const dynamic = 'force-dynamic';

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
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Men Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function MenPage() {
  const allProducts = await getProducts() || [];

  // 1. Filter ONLY Men's Ethnic Wear using the new Database structure
  const menEthnicProducts = allProducts.filter((product) => 
    (product.gender === 'Men' || product.gender === 'Unisex') &&
    Array.isArray(product.categories) && 
    product.categories.includes('Ethnic Wear')
  );

  // 2. Filter ONLY Men's Western Wear using the new Database structure
  const menWesternProducts = allProducts.filter((product) => 
    (product.gender === 'Men' || product.gender === 'Unisex') &&
    Array.isArray(product.categories) && 
    product.categories.includes('Western Wear')
  );

  return (
    <main>
      <script
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
        viewAllLink="/ethnic-wear"
        products={menEthnicProducts} // Sending strictly filtered data
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        viewAllLink="/western-wear"
        products={menWesternProducts} // Sending strictly filtered data
      />
      
      <MenDescription />
    </main>
  );
}