export const dynamic = 'force-dynamic';

import WomenHero from "@/components/women/WomenHero";
import ShopSection from "@/components/shared/ShopSection";
import WomenDescription from "@/components/women/WomenDescription";
import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "Buy Designer Outfits for Women Online | SRIJAN Fashion",
  description: "Shop stylish outfits for women at SRIJAN Fashion. Explore designer outfits & premium women wear perfect for every occasion. Buy online with ease today.",
};

export default async function WomenPage() {
  const allProducts = await getProducts(); 

  return (
    <main>
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