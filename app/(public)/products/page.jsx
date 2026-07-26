export const dynamic = 'force-dynamic';
import ProductsHero from "@/components/product/ProductsHero"; 
import ShopSection from "@/components/shared/ShopSection";
import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "All Products | SRIJAN Fashion",
  description: "Explore our wide range of collections for men, women, and bridal wear.",
};

export default async function ProductPage() {
  const allProducts = await getProducts(); 

  return (
    <main>
      <ProductsHero />
      
      <ShopSection 
        title="Trending in Women's Wear" 
        category="Women" 
        viewAllLink="/women" 
        products={allProducts} 
      />
      
      <ShopSection 
        title="Best in Men's Ethnic" 
        category="Men" 
        viewAllLink="/ethnic-wear" 
        products={allProducts} 
      />

      <ShopSection 
        title="Exclusive Bridal Collection" 
        category="Bridal" 
        viewAllLink="/wedding" 
        products={allProducts}
      />
    </main>
  );
}