export const dynamic = 'force-dynamic';

import CustomizeHero from "@/components/customize/CustomizeHero";
import BaseStyles from "@/components/customize/BaseStyles";
import DesignProcess from "@/components/customize/DesignProcess";
import PerfectFit from "@/components/customize/PerfectFit";
import CustomizeFaq from "@/components/customize/CustomizeFaq";

export const metadata = {
  title: "Designer Dress | Custom Dresses Made for Your Unique Style",
  description: "Create your perfect designer dress with Srijan Fashion. Explore custom dresses built around your ideas, measurements & style, from sketch to final stitch.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/create-designer-dress',
  },
  openGraph: {
    title: 'Designer Dress | Custom Dresses Made for Your Unique Style',
    description: 'Create your perfect designer dress with Srijan Fashion. Explore custom dresses built around your ideas, measurements & style, from sketch to final stitch.',
    url: 'https://www.srijandesignerstudio.com/create-designer-dress',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Custom Dress',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function CustomizePage() {
  return (
    <main className="bg-white">
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
              "name": "Create Custom Dress",
              "item": "https://www.srijandesignerstudio.com/create-designer-dress"  
            }]
          })
        }}
      />
      <CustomizeHero />
      <BaseStyles />
      <DesignProcess />
      <PerfectFit />
      <CustomizeFaq />
    </main>
  );
}