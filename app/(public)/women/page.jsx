export const dynamic = 'force-dynamic';

import WomenHero from "@/components/women/WomenHero";
import ShopSection from "@/components/shared/ShopSection";
import WomenDescription from "@/components/women/WomenDescription";
import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "Women's Fashion | SRIJAN Fashion",
  description: "Discover elegant designer outfits and trendy women wear crafted to match your style, comfort and every occasion.",
};

export default async function WomenPage() {
  const allProducts = await getProducts(); 

  return (
    <main>
      <WomenHero />
      <ShopSection 
        title="Shop Ethnic Wear" 
        category="Women Ethnic" 
        viewAllLink="/ethnic-wear" 
        products={allProducts} 
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        category="Women Western" 
        viewAllLink="/western-wear" 
        products={allProducts} 
      />
      <WomenDescription />
    </main>
  );
}