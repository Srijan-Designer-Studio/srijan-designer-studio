import MenHero from "@/components/men/MenHero";
import ShopSection from "@/components/shared/ShopSection";
import MenDescription from "@/components/men/MenDescription";
import { getProducts } from "@/app/actions/products";

export default async function MenPage() {
  // Fetch real data from the database for the specific categories
  // (Assuming 'men-ethnic' and 'men-western' are the slugs in your categories table)
  const ethnicProducts = await getProducts('men-ethnic');
  const westernProducts = await getProducts('men-western');

  return (
    <main>
      <MenHero />
      
      {/* Pass the real database products to the section */}
      <ShopSection 
        title="Shop Ethnic Wear" 
        category="Men Ethnic" 
        viewAllLink="/men/ethnic-wear" 
        products={ethnicProducts}
      />
      
      <ShopSection 
        title="Shop Western Wear" 
        category="Men Western" 
        viewAllLink="/men/western-wear" 
        products={westernProducts}
      />
      
      <MenDescription />
    </main>
  );
}