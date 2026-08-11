export const dynamic = 'force-dynamic';

import MenHero from "@/components/men/MenHero";
import ShopSection from "@/components/shared/ShopSection";
import MenDescription from "@/components/men/MenDescription";
import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "Buy Designer Outfits for Men Online | SRIJAN Fashion",
  description: "Shop stylish outfits for men at SRIJAN Fashion. Discover trendy men wear and versatile men outfits for every occasion. Buy online with comfort and ease.",
};

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