export const revalidate = 3600;

import { createAdminClient } from '@/lib/supabase/admin';
import NewArrivalsGrid from './NewArrivalsGrid';
import ScrollToTop from '@/components/providers/ScrollToTop';

export const metadata = {
  title: "New Arrivals | SRIJAN Fashion",
  description: "Discover our latest collections and newly arrived trendy wear. Shop the newest arrivals at SRIJAN Fashion today.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/new-arrivals',
  },
  openGraph: {
    title: 'New Arrivals | SRIJAN Fashion',
    description: 'Discover our latest collections and newly arrived trendy wear. Shop the newest arrivals at SRIJAN Fashion today.',
    url: 'https://www.srijandesignerstudio.com/new-arrivals',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion New Arrivals',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/", 
            "@type": "BreadcrumbList", 
            "itemListElement": [{
              "@type": "ListItem", 
              "position": 1, 
              "name": "Home",
              "item": "https://srijandesignerstudio.com"  
            },{
              "@type": "ListItem", 
              "position": 2, 
              "name": "New Arrivals",
              "item": "https://www.srijandesignerstudio.com/new-arrivals"  
            }]
          })
        }}
      />
      <ScrollToTop />
      <NewArrivalsGrid products={products || []} />
    </main>
  );
}