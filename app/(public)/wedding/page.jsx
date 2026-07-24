export const dynamic = 'force-dynamic';
import WeddingHero from "@/components/Wedding/WeddingHero";
import WeddingInspiration from "@/components/Wedding/WeddingInspiration";
import HowItWorks from "@/components/Wedding/HowItWorks";
import OccasionsEdit from "@/components/Wedding/OccasionsEdit";
import EditByCategory from "@/components/Wedding/EditByCategory";
import WeddingContactForm from "@/components/Wedding/WeddingContactForm";
import WeddingFAQ from "@/components/Wedding/WeddingFAQ";

import ShopSection from "@/components/shared/ShopSection";

export const metadata = {
  title: "Wedding Edit | SRIJAN Fashion",
  description: "Find the wedding wear that feels right for your big day or create a custom look that's truly yours.",
};

export default function WeddingPage() {
  return (
    <main>
      <WeddingHero />
      <ShopSection 
        title="Our Exclusive Wedding Collection" 
        category="Bridal" 
        viewAllLink="/wedding/collection" 
      />
      <HowItWorks />
      <OccasionsEdit />
      <EditByCategory />
      <WeddingInspiration />
      <WeddingContactForm />
      <WeddingFAQ />
    </main>
  );
}