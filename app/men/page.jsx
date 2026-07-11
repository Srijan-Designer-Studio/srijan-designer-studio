import MenHero from "@/components/men/MenHero";
import ShopSection from "@/components/shared/ShopSection";
import MenDescription from "@/components/men/MenDescription";

export default function MenPage() {
  return (
    <main>
      <MenHero />
      
 
      <ShopSection 
        title="Shop Ethnic Wear" 
        category="Men Ethnic" 
        viewAllLink="/men/ethnic-wear" 
      />
      
  
      <ShopSection 
        title="Shop Western Wear" 
        category="Men Western" 
        viewAllLink="/men/western-wear" 
      />
      
      <MenDescription />
    </main>
  );
}