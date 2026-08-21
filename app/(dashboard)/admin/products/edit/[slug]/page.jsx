import ProductWizard from "@/components/admin/ProductWizard/ProductWizard";
import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Product | Admin Dashboard',
};

export default async function EditProductPage({ params }) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*), product_images(*), product_components(*)')
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    title: product.title || "",
    productType: product.product_type || "Saree",
    brand: product.brand || "Srijan Fashion",
    shortDesc: product.short_description || "",
    description: product.full_description || "",
    materialCare: product.material_care || "",
    highlights: product.highlights || "",
    additionalInfo: product.additional_info || "",
    department: product.gender || "Women",
    basePrice: product.base_price || "",
    salePrice: product.sale_price || "",
    categories: product.categories || [],
    collections: product.collections || [],
    occasions: product.occasions || [],
    tags: product.tags || [],
    images: product.product_images?.map((img, idx) => ({
      id: img.id || Date.now() + idx,
      file: null,
      preview: img.image_url,
      altText: img.alt_text || "",
      isPrimary: img.is_primary || false
    })) || [],
    variants: product.product_variants?.length > 0 ? product.product_variants.map(v => ({
      id: v.id,
      size: v.size || "",
      color: v.color || "",
      sku: v.sku || "",
      stock: v.inventory_count || "0",
      lowStock: v.low_stock_threshold || "5",
      barcode: v.barcode || ""
    })) : [{ id: Date.now(), size: "Free Size", color: "", sku: "", stock: "10", lowStock: "5", barcode: "" }],
    purchaseType: product.purchase_type || "Single Product",
    components: product.product_components?.map(c => ({
      id: c.id,
      name: c.name || "",
      required: c.is_required ?? true,
      price: c.price || ""
    })) || [],
    weight: product.weight || "",
    length: product.length || "",
    width: product.width || "",
    height: product.height || "",
    shippingClass: product.shipping_class || "Standard",
    estimatedDelivery: product.estimated_delivery || "3-5 Days",
    isCodAvailable: product.is_cod_available ?? true,
    isFreeShipping: product.is_free_shipping ?? false,
    isReturnEligible: product.is_return_eligible ?? true,
    shippingPolicy: product.shipping_policy || "",
    returnPolicy: product.return_policy || "",
    faqs: product.faqs || [],
    seoTitle: product.seo_title || "",
    seoSlug: product.slug || "",
    metaDesc: product.meta_desc || "",
    focusKeyword: product.focus_keyword || "",
    seoKeywords: product.seo_keywords || "",
    ogTitle: product.og_title || "",
    ogDesc: product.og_description || "",
    canonicalUrl: product.canonical_url || ""
  };

  return <ProductWizard initialData={initialData} />;
}