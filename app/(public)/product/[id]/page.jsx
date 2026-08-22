import { notFound } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerReviews from "@/components/product/CustomerReviews";
import SimilarProducts from "@/components/product/SimilarProducts";
import ProductFAQ from "@/components/product/ProductFAQ";
import { getProductBySlug, getProducts } from "@/app/actions/products"; 
import ScrollToTop from "@/components/providers/ScrollToTop";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.id);
  
  if (!product) return { title: 'Product Not Found | SRIJAN Fashion' };

  const imageUrl = product.product_images?.[0]?.image_url || '/images/logo1.png';
  const description = product.description?.substring(0, 160) || `Buy ${product.title} online at best prices on SRIJAN Fashion.`;
  const productUrl = `https://www.srijandesignerstudio.com/product/${resolvedParams.id}`;

  return {
    title: `${product.title} | SRIJAN Fashion`,
    description: description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.title,
      description: description,
      url: productUrl,
      siteName: 'Srijan Fashion',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
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

  const allProducts = await getProducts() || [];
  const similarProducts = allProducts
    .filter(p => p.gender === product.gender && p.id !== product.id)
    .slice(0, 4);

  const imageUrl = product.product_images?.[0]?.image_url || 'https://www.srijandesignerstudio.com/images/logo3.jpg';
  const productUrl = `https://www.srijandesignerstudio.com/product/${id}`;

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": [imageUrl],
    "description": product.description || `Buy ${product.title} online at best prices on SRIJAN Fashion.`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "SRIJAN Fashion"
    },
    "offers": {
      "@type": "Offer",
      "url": productUrl,
      "priceCurrency": "INR",
      "price": product.base_price || 0,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.is_active !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ScrollToTop />
      
     
      <ProductDetails product={product} />
      
    
      <CustomerReviews productId={product.id} />
      
      
      <SimilarProducts similarProducts={similarProducts} />

  
      <div className="max-w-[1320px] mx-auto px-6">
        <ProductFAQ faqs={product.faqs} />
      </div>
      
    </main>
  );
}