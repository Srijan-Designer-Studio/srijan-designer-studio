export const revalidate = 3600;

import { createAdminClient } from '@/lib/supabase/admin';
import OccasionGrid from './OccasionGrid';
import ScrollToTop from '@/components/providers/ScrollToTop';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.replace(/-/g, ' ');
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `${title} Collection | SRIJAN Fashion`,
    description: `Explore our exclusive collection for ${title}.`,
  };
}

export default async function OccasionPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const supabase = createAdminClient();

 
  const searchTerm = slug.replace(/-/g, ' ').replace('edits', '').trim().toLowerCase();

  const { data: allProducts } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      title,
      base_price,
      product_type,
      tags,
      categories(name),
      product_images(image_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

 
  const products = (allProducts || []).filter((product) => {
    const dbType = String(product.product_type || "").toLowerCase();
    const dbCategory = String(product.categories?.name || "").toLowerCase();
    const dbTitle = String(product.title || "").toLowerCase();
    const dbTags = String(product.tags || "").toLowerCase(); 

    const terms = searchTerm.split(' '); 
    return terms.some(term =>
      dbTags.includes(term) || dbType.includes(term) || dbCategory.includes(term) || dbTitle.includes(term)
    );
  });

  const displayTitle = slug.replace(/-/g, ' ');

  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 bg-white min-h-screen relative">
      <ScrollToTop />
      <OccasionGrid products={products || []} title={`${displayTitle} Collection`} />
    </main>
  );
}