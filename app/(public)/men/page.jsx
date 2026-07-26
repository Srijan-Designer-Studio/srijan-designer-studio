export const dynamic = 'force-dynamic';

import MenHero from "@/components/men/MenHero";
import ShopSection from "@/components/shared/ShopSection";
import MenDescription from "@/components/men/MenDescription";
import { getProducts } from "@/app/actions/products";

export default async function MenPage() {
  const allProducts = await getProducts();

  return (
    <main>
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