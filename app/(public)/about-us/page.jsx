export const dynamic = 'force-dynamic';

import AboutHero from "@/components/About/AboutHero";
import Founder from "@/components/About/Founder";
import WhatWeDo from "@/components/About/WhatWeDo";
import AboutSrijan from "@/components/About/AboutSrijan";
import MissionVision from "@/components/About/MissionVision";
import OurPromise from "@/components/About/OurPromise";
import Faq from "@/components/About/FAQ";

export const metadata = {
  title: "About Us - The Ultimate Designer Studio - SRIJAN Fashion",
  description: "Discover Srijan Fashion, built on creativity, craftsmanship & personal style. Learn our story, what we do, our mission, vision & promise to you with purpose.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/about-us',
  },
  openGraph: {
    title: 'About Us - The Ultimate Designer Studio - SRIJAN Fashion',
    description: 'Discover Srijan Fashion, built on creativity, craftsmanship & personal style. Learn our story, what we do, our mission, vision & promise to you with purpose.',
    url: 'https://www.srijandesignerstudio.com/about-us',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion About Us',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function AboutPage() {
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
              "name": "About Us",
              "item": "https://www.srijandesignerstudio.com/about-us"  
            }]
          })
        }}
      />
      <AboutHero />
      <AboutSrijan />
      <WhatWeDo />
      <OurPromise />
      <Founder />
      <MissionVision />
      <Faq />
    </main>
  );
}