
export const dynamic = 'force-dynamic';
import KidsHero from "@/components/kids/KidsHero";
import KidsMemory from "@/components/kids/KidsMemory";
import KidsLooks from "@/components/kids/KidsLooks";
import KidsProcess from "@/components/kids/KidsProcess";
import KidsGallery from "@/components/kids/KidsGallery";
import KidsContact from "@/components/kids/KidsContact";
import KidsFAQ from "@/components/kids/KidsFAQ";

export const metadata = {
  title: "Customize Kids Wear | SRIJAN Fashion",
  description: "Click your kids every little special moments with custom kids wear.",
};

export default function KidsPage() {
  return (
    <main>
      <KidsHero />
      <KidsMemory />
      <KidsLooks />
      <KidsProcess />
      <KidsGallery />
      <KidsContact />
      <KidsFAQ />
    </main>
  );
}
