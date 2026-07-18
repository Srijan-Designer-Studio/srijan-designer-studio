import ProductsHero from "@/components/product/ProductsHero"; 
// import ShopStyles from "@/components/product/ShopStyles";


import ShopSection from "@/components/shared/ShopSection";

export const metadata = {
  title: "All Products | SRIJAN Fashion",
  description: "Explore our wide range of collections for men, women, and bridal wear.",
};

export default function ProductPage() {
  return (
    <main>
    
      <ProductsHero />
      {/* <ShopStyles /> */}
      
     
      <ShopSection 
        title="Trending in Women's Wear" 
        category="Women" // products.js-এ এই ক্যাটাগরি থাকলে ডেটা চলে আসবে
        viewAllLink="/women" 
      />
      
      <ShopSection 
        title="Best in Men's Ethnic" 
        category="Men Ethnic" 
        viewAllLink="/men/ethnic-wear" 
      />

      <ShopSection 
        title="Exclusive Bridal Collection" 
        category="Bridal" 
        viewAllLink="/wedding" 
      />
    </main>
  );
}