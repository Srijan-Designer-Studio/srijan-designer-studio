import { notFound } from "next/navigation";
import Script from "next/script";
import ProductDetails from "@/components/product/ProductDetails";
import CustomerReviews from "@/components/product/CustomerReviews";
import SimilarProducts from "@/components/product/SimilarProducts";
import ProductFAQ from "@/components/product/ProductFAQ";
import { getProductBySlug, getProducts } from "@/app/actions/products"; 
import ScrollToTop from "@/components/providers/ScrollToTop";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.id);
  
  if (!product) return { title: 'Product Not Found | SRIJAN Fashion' };

  const imageUrl = product.product_images?.[0]?.image_url || '/images/logo1.png';
  const defaultDescription = product.short_description || product.description?.substring(0, 160) || `Buy ${product.title} online at best prices on SRIJAN Fashion.`;
  const defaultUrl = `https://www.srijandesignerstudio.com/product/${resolvedParams.id}`;

  const seoTitle = product.seo_title || `${product.title} | SRIJAN Fashion`;
  const seoDesc = product.meta_desc || defaultDescription;
  const canonical = product.canonical_url || defaultUrl;
  const keywords = product.seo_keywords || product.focus_keyword || "";

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: keywords,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: canonical,
      siteName: 'Srijan Fashion',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDesc,
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

  const supabase = createAdminClient();
  await supabase
    .from('products')
    .update({ view_count: (product.view_count || 0) + 1 })
    .eq('id', product.id);

  const allProducts = await getProducts() || [];
  const similarProducts = allProducts
    .filter(p => p.gender === product.gender && p.id !== product.id)
    .slice(0, 4);

  const imageUrl = product.product_images?.[0]?.image_url || 'https://www.srijandesignerstudio.com/images/logo3.jpg';
  const productUrl = `https://www.srijandesignerstudio.com/product/${id}`;

  const defaultSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.seo_title || product.title,
    "image": [imageUrl],
    "description": product.meta_desc || product.short_description || `Buy ${product.title} online at best prices on SRIJAN Fashion.`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "SRIJAN Fashion"
    },
    "offers": {
      "@type": "Offer",
      "url": product.canonical_url || productUrl,
      "priceCurrency": "INR",
      "price": product.base_price || 0,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.is_active !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  let cleanSchemaMarkup = JSON.stringify(defaultSchema);
  
  if (product.schema_markup) {
    cleanSchemaMarkup = product.schema_markup
      .replace(/<script[^>]*>/gi, '')
      .replace(/<\/script>/gi, '')
      .trim();
  }

  return (
    <main>
      <Script
        id={`product-schema-${product.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: cleanSchemaMarkup }}
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