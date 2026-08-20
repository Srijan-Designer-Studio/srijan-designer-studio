import ShopStyleClient from "./ShopStyleClient";

export const metadata = {
  title: "Shop Styles | SRIJAN Fashion",
  description: "Explore our complete collection of designer outfits at SRIJAN Fashion. Search and shop for sarees, lehengas, kurtis, and more.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/shop-style',
  },
  openGraph: {
    title: 'Shop Styles | SRIJAN Fashion',
    description: 'Explore our complete collection of designer outfits at SRIJAN Fashion. Search and shop for sarees, lehengas, kurtis, and more.',
    url: 'https://www.srijandesignerstudio.com/shop-style',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Shop Styles',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ShopStylePage() {
  return (
    <>
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
              "name": "Shop Styles",
              "item": "https://www.srijandesignerstudio.com/shop-style"  
            }]
          })
        }}
      />
      <ShopStyleClient />
    </>
  );
}