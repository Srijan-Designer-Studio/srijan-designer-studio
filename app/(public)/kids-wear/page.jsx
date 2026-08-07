export const revalidate = 3600;

import KidsWearClient from './KidsWearClient';
import ScrollToTop from '@/components/providers/ScrollToTop';

export const metadata = {
    title: "Customize Kids Wear | SRIJAN Fashion",
    description: "Capture every little moment, dressed just right. Custom tailor-made kids wear for special occasions.",
};

export default function KidsWearPage() {
    return (
        <main>
            <ScrollToTop />
            <KidsWearClient />
        </main>
    );
}