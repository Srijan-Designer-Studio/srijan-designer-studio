import WeddingHero from "@/components/wedding/WeddingHero";
import WeddingInspiration from "@/components/wedding/WeddingInspiration";
import HowItWorks from "@/components/wedding/HowItWorks";
import OccasionsEdit from "@/components/wedding/OccasionsEdit";
import EditByCategory from "@/components/wedding/EditByCategory";
import WeddingContactForm from "@/components/wedding/WeddingContactForm";
import WeddingFAQ from "@/components/wedding/WeddingFAQ";
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