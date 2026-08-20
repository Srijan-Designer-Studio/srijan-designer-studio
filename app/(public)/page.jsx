export const dynamic = 'force-dynamic';

import Hero from "@/components/Home/Hero/Hero";
import AboutIntro from "@/components/Home/about/About";
import Collection from "@/components/Home/collection/Collection";
import ShopEssentials from "@/components/Home/ShopEssentials/ShopEssentials";
import FeaturedVideo from "@/components/Home/home-video/FeaturedVideo";
import CustomizeWear from "@/components/Home/customizeWear/CustomizeWear";
import CustomizeWedding from "@/components/Home/customizeWedding/CustomizeWedding";
import CustomizeKidsWear from "@/components/Home/customizeKidsWear/CustomizeKidsWear";
import Blogs from "@/components/Home/blog/Blogs";
import Testimonials from "@/components/Home/testimonials/Testimonials";
import FAQ from "@/components/Home/faq/FAQ";

import { getProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/admin";

export const metadata = {
  title: 'SRIJAN Fashion | Fashion Styles for Every Occasion & Look',
  description: ' Explore SRIJAN Fashion for unique fashion styles & online shopping featuring designer, ethnic and custom wear crafted to bring your personal style to life.',
  alternates: {
    canonical: 'https://srijandesignerstudio.com',
  },
  openGraph: {
    title: 'Srijan Fashion | Luxury Designer Studio',
    description: 'Explore our exclusive collection of premium sarees, lehengas, kurtas, and custom designer outfits.',
    url: 'https://srijandesignerstudio.com',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Banner',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function Home() {
  const [categories, essentialProducts] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SRIJAN Fashion",
            "image": "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlSqM1M2-obkVcZhGI2I4wFjOWshshe704fm9mOrB8DThUBQlvDWqaFNRopB3YPpISGXtCR59Qtf_lHT0lxgzTOUW3RlaCOtSSqjxa_7T_vUwH9tR56Re-_HomUGH27mgZZ5AnVu4Nokjkz=w408-h283-k-no",
            "@id": "",
            "url": "https://www.google.com/search?q=srijan+fashion&rlz=1C1CHZN_enIN1219IN1219&oq=srijan+fashion&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIICAEQABgWGB4yDQgCEAAYhgMYgAQYigUyDQgDEAAYhgMYgAQYigUyBwgEEAAY7wUyBggFEEUYPDIGCAYQRRg9MgYIBxBFGDzSAQgzODE0ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#sv=CAwSQAoGbGNsX3B2EhsKA3B2cRIUQ2cwdlp5OHhNWFpxTTJkZk9HTnkSBQoBcRIAGhJsb2NhbC1wbGFjZS12aWV3ZXIYCiCclPP9BQ",
            "telephone": "6290686399",
            "priceRange": "1000 - 500000",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Chhobi Apartment, Sani Mandir, Panchasayar Main Road, Panchasayar",
              "addressLocality": "Kolkata",
              "addressRegion": "West Bengal",
              "postalCode": "700094",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 22.46940913032653,
              "longitude": 88.40250731534286
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              "opens": "10:00+05:30",
              "closes": "21:30+05:30"
            },
            "sameAs": [
              "https://www.facebook.com/srijanfashion2022",
              "https://www.instagram.com/srijanfashion2022",
              "https://x.com/SrijanFashion",
              "https://www.youtube.com/@srijanfashion",
              "https://in.pinterest.com/srijanfashion/",
              "https://www.tumblr.com/srijanfashion"
            ]
          })
        }}
      />
      
      <Hero />
      <AboutIntro />
      <Collection categories={categories} />
      <ShopEssentials products={essentialProducts} />
      <FeaturedVideo />
      <CustomizeWear />
      <CustomizeWedding />
      <CustomizeKidsWear />
      <Blogs />
      <Testimonials />
      <FAQ />
    </main>
  );
}