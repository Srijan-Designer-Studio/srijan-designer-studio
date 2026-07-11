import WomenHero from "@/components/women/WomenHero";
import ShopSection from "@/components/shared/ShopSection";
import WomenDescription from "@/components/women/WomenDescription";

export const metadata = {
  title: "Women's Fashion | SRIJAN Fashion",
  description: "Discover elegant designer outfits and trendy women wear crafted to match your style, comfort and every occasion.",
};

export default function WomenPage() {
  return (
    <main>
      <WomenHero />
      <ShopSection 
        title="Shop Ethnic Wear" 
        category="Women Ethnic" 
        viewAllLink="/women/ethnic-wear" 
      />
      
      
      <ShopSection 
        title="Shop Western Wear" 
        category="Women Western" 
        viewAllLink="/women/western-wear" 
      />
      <WomenDescription />
    </main>
  );
}