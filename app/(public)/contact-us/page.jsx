export const dynamic = 'force-dynamic';

import ContactHero from "@/components/Contact/ContactHero";
import ContactDetails from "@/components/Contact/ContactDetails";

export const metadata = {
  title: "Contact SRIJAN Fashion | Visit Our Studio & Get in Touch",
  description: "Get in touch with Srijan Fashion for custom outfits, styling queries or consultations. Visit our Kolkata studio, call us or send a message to discuss your ideas.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/contact-us',
  },
  openGraph: {
    title: 'Contact SRIJAN Fashion | Visit Our Studio & Get in Touch',
    description: 'Get in touch with Srijan Fashion for custom outfits, styling queries or consultations. Visit our Kolkata studio, call us or send a message to discuss your ideas.',
    url: 'https://www.srijandesignerstudio.com/contact-us',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Contact Us',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ContactPage() {
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
              "name": "Contact Us",
              "item": "https://www.srijandesignerstudio.com/contact-us"  
            }]
          })
        }}
      />
      <ContactHero />
      <ContactDetails />
    </main>
  );
}