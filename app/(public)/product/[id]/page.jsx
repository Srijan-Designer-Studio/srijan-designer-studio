import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerReviews from "@/components/product/CustomerReviews";
import SimilarProducts from "@/components/product/SimilarProducts";
import { getProductBySlug } from "@/app/actions/products";

// Server Component
export default async function SingleProductPage({ params }) {
  // Await the params object (Required in Next.js 16)
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Fetch live product data from Supabase
  const product = await getProductBySlug(id);

  if (!product) {
    return notFound(); // Utilizes the Next.js _not-found.jsx UI automatically
  }

  return (
    <main>
      {/* Pass the fully hydrated product object down to client components */}
      <ProductDetails product={product} />
      
      {/* Fetch reviews dynamically inside this component based on product.id */}
      <CustomerReviews productId={product.id} />
      
      {/* Fetch similar products based on the dynamic category ID */}
      <SimilarProducts 
        categoryId={product.category_id} 
        currentProductId={product.id} 
      />
    </main>
  );
}