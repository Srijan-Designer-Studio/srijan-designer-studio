export const revalidate = 3600;

import { createAdminClient } from '@/lib/supabase/admin';
import NewArrivalsGrid from './NewArrivalsGrid';
import ScrollToTop from '@/components/providers/ScrollToTop';

export const metadata = {
  title: "New Arrivals | SRIJAN Fashion",
  description: "Discover our latest collections and newly arrived trendy wear.",
};

export default async function NewArrivalsPage() {
  const supabase = createAdminClient();

  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      title,
      base_price,
      product_images(image_url)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(16);

  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 bg-white min-h-screen relative">
      <ScrollToTop />
      <NewArrivalsGrid products={products || []} />
    </main>
  );
}