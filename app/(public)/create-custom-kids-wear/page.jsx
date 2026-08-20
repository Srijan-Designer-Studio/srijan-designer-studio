export const revalidate = 3600;

import KidsWearClient from './KidsWearClient';
import ScrollToTop from '@/components/providers/ScrollToTop';

export const metadata = {
    title: "Customize Kids Wear | Custom Kids Outfits | SRIJAN Fashion",
    description: "Create unique kids wear with Srijan Fashion. Explore custom kids outfits designed around your kid's style, occasion & comfort, made for every special moment.",
    alternates: {
        canonical: 'https://www.srijandesignerstudio.com/create-custom-kids-wear',
    },
    openGraph: {
        title: 'Customize Kids Wear | Custom Kids Outfits | SRIJAN Fashion',
        description: "Create unique kids wear with Srijan Fashion. Explore custom kids outfits designed around your kid's style, occasion & comfort, made for every special moment.",
        url: 'https://www.srijandesignerstudio.com/create-custom-kids-wear',
        siteName: 'Srijan Fashion',
        images: [
            {
                url: '/images/logo3.jpg', 
                width: 1200,
                height: 630,
                alt: 'Srijan Fashion Custom Kids Wear',
            },
        ],
        locale: 'en_IN',
        type: 'website',
    },
};

export default function KidsWearPage() {
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
                            "name": "Custom Kids Wear",
                            "item": "https://www.srijandesignerstudio.com/create-custom-kids-wear"  
                        }]
                    })
                }}
            />
            <ScrollToTop />
            <KidsWearClient />
        </main>
    );
}