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
  const allProducts = await getProducts();

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
        category="Men"
        type="Ethnic Wear"
        viewAllLink="/ethnic-wear"
        products={allProducts}
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        category="Men"
        type="Western Wear"
        viewAllLink="/western-wear"
        products={allProducts}
      />
      
      <MenDescription />
    </main>
  );
}