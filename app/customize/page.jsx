import CustomizeHero from "@/components/customize/CustomizeHero";
import BaseStyles from "@/components/customize/BaseStyles";
import DesignProcess from "@/components/customize/DesignProcess";
import PerfectFit from "@/components/customize/PerfectFit";
import CustomizeFaq from "@/components/customize/CustomizeFaq";

export const metadata = {
  title: "Customize Your Dress | SRIJAN Fashion",
  description: "Design a one of a kind outfit with our custom dresses service.",
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
