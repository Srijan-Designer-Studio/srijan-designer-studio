export const dynamic = 'force-dynamic';

import AboutHero from "@/components/About/AboutHero";
import Founder from "@/components/About/Founder";
import WhatWeDo from "@/components/About/WhatWeDo";
import AboutSrijan from "@/components/About/AboutSrijan";
import MissionVision from "@/components/About/MissionVision";
import OurPromise from "@/components/About/OurPromise";
import Faq from "@/components/Home/faq/FAQ";

export const metadata = {
  title: "About Us - The Ultimate Designer Studio - SRIJAN Fashion",
  description: "Discover Srijan Fashion, built on creativity, craftsmanship & personal style. Learn our story, what we do, our mission, vision & promise to you with purpose.",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      <AboutHero />
      <AboutSrijan />
      <WhatWeDo />
      <OurPromise />
      <Founder />
      <MissionVision />
      <Faq />
    </main>
  );
}