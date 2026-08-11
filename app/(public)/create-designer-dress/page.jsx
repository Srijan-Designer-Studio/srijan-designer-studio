export const dynamic = 'force-dynamic';
import CustomizeHero from "@/components/customize/CustomizeHero";
import BaseStyles from "@/components/customize/BaseStyles";
import DesignProcess from "@/components/customize/DesignProcess";
import PerfectFit from "@/components/customize/PerfectFit";
import CustomizeFaq from "@/components/customize/CustomizeFaq";

export const metadata = {
  title: "Designer Dress | Custom Dresses Made for Your Unique Style",
  description: "Create your perfect designer dress with Srijan Fashion. Explore custom dresses built around your ideas, measurements & style, from sketch to final stitch.",
};

export default function CustomizePage() {
  return (
    <main className="bg-white">
      <CustomizeHero />
      <BaseStyles />
      <DesignProcess />
      <PerfectFit />
      <CustomizeFaq />
    </main>
  );
}
