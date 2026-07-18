import ProductDetails from "@/components/product/ProductDetails";
import CustomerReviews from "@/components/product/CustomerReviews";
import SimilarProducts from "@/components/product/SimilarProducts";


import { allProducts } from "@/data/products"; 

export default async function SingleProductPage({ params }) {
  
  const { id } = await params;
  
 
  const product = allProducts.find((p) => p.id.toString() === id?.toString());

  
  if (!product) {
    return (
      <main className="py-32 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found!</h1>
        <p className="text-gray-500">The product you are looking for does not exist or has been removed.</p>
      </main>
    );
  }

 
  return (
    <main>
     
      <ProductDetails id={id} />
      
      <CustomerReviews id={id} />
      
      
      <SimilarProducts 
        currentCategory={product.category} 
        currentProductId={product.id} 
      />
    </main>
  );
}