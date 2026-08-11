export const revalidate = 3600;

import KidsWearClient from './KidsWearClient';
import ScrollToTop from '@/components/providers/ScrollToTop';

export const metadata = {
    title: "Customize Kids Wear | Custom Kids Outfits | SRIJAN Fashion",
    description: "Create unique kids wear with Srijan Fashion. Explore custom kids outfits designed around your kid's style, occasion & comfort, made for every special moment.",
};

export default function KidsWearPage() {
    return (
        <main>
            <ScrollToTop />
            <KidsWearClient />
        </main>
    );
}