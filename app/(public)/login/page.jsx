import AuthClient from "./AuthClient";

export const metadata = {
  title: "Login / Register | SRIJAN Fashion",
  description: "Log in or create an account at SRIJAN Fashion to track your orders, save your favorite designer outfits, and manage your profile.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/login',
  },
  openGraph: {
    title: 'Login / Register | SRIJAN Fashion',
    description: 'Log in or create an account at SRIJAN Fashion to track your orders, save your favorite designer outfits, and manage your profile.',
    url: 'https://www.srijandesignerstudio.com/login',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Login',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function LoginPage() {
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
              "name": "Login",
              "item": "https://www.srijandesignerstudio.com/login"  
            }]
          })
        }}
      />
      <AuthClient />
    </>
  );
}