import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerReviews from "@/components/product/CustomerReviews";
import SimilarProducts from "@/components/product/SimilarProducts";
import { getProductBySlug } from "@/app/actions/products";

export const revalidate = 60; 

// Dynamic SEO / OpenGraph Metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.id);
  
  if (!product) return { title: 'Product Not Found | SRIJAN Fashion' };

  const imageUrl = product.product_images?.[0]?.image_url || '/images/logo1.png';
  const description = product.description?.substring(0, 160) || `Buy ${product.title} online at best prices on SRIJAN Fashion.`;

  return {
    title: `${product.title} | SRIJAN Fashion`,
    description: description,
    openGraph: {
      title: product.title,
      description: description,
      images: [{ url: imageUrl }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: description,
      images: [imageUrl],
    }
  };
}

export default async function SingleProductPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  const product = await getProductBySlug(id);

  if (!product) {
    return notFound();
  }

  return (
    <main>
      <ProductDetails product={product} />
      <CustomerReviews productId={product.id} />
      <SimilarProducts 
        categoryId={product.category_id} 
        currentProductId={product.id} 
      />
    </main>
  );
}