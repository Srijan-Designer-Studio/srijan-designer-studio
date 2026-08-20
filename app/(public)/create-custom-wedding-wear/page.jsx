export const dynamic = 'force-dynamic';

import WeddingHero from "@/components/Wedding/WeddingHero";
import WeddingInspiration from "@/components/Wedding/WeddingInspiration";
import WeddingCollection from "@/components/Wedding/WeddingCollection";
import HowItWorks from "@/components/Wedding/HowItWorks";
import OccasionsEdit from "@/components/Wedding/OccasionsEdit";
import EditByCategory from "@/components/Wedding/EditByCategory";
import WeddingContactForm from "@/components/Wedding/WeddingContactForm";
import WeddingFAQ from "@/components/Wedding/WeddingFAQ";

import { getProducts } from "@/app/actions/products";

export const metadata = {
  title: "Wedding Edit | SRIJAN Fashion",
  description: "Find the wedding wear that feels right for your big day or create a custom look that's truly yours.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/create-custom-wedding-wear',
  },
  openGraph: {
    title: 'Wedding Edit | SRIJAN Fashion',
    description: "Find the wedding wear that feels right for your big day or create a custom look that's truly yours.",
    url: 'https://www.srijandesignerstudio.com/create-custom-wedding-wear',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Wedding Edit',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function WeddingPage() {
  const response = await getProducts();
  const allProducts = Array.isArray(response) ? response : (response?.data || []);

  return (
    <main>
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
              "name": "Custom Wedding Wear",
              "item": "https://www.srijandesignerstudio.com/create-custom-wedding-wear"  
            }]
          })
        }}
      />
      <WeddingHero />
      <WeddingCollection />
      <WeddingInspiration />
      <HowItWorks />
      <OccasionsEdit />
      <EditByCategory />
      <WeddingContactForm />
      <WeddingFAQ />
    </main>
  );
}