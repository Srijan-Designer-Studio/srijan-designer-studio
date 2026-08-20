export const dynamic = 'force-dynamic';

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
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Women Collection',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function WomenPage() {
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
              "name": "For Women",
              "item": "https://www.srijandesignerstudio.com/buy-designer-outfits-for-women-online"  
            }]
          })
        }}
      />
      <WomenHero />
      
      <ShopSection 
        title="Shop Ethnic Wear" 
        category="Women"
        type="Ethnic Wear"
        viewAllLink="/ethnic-wear" 
        products={allProducts} 
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        category="Women"
        type="Western Wear"
        viewAllLink="/western-wear" 
        products={allProducts} 
      />
      
      <WomenDescription />
    </main>
  );
}