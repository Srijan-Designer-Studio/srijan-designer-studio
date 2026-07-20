import AboutHero from "@/components/About/AboutHero";
import Founder from "@/components/About/Founder";
import WhatWeDo from "@/components/About/WhatWeDo";
import AboutSrijan from "@/components/About/AboutSrijan";
import MissionVision from "@/components/About/MissionVision";
import OurPromise from "@/components/About/OurPromise";
import Faq from "@/components/Home/faq/FAQ";

export const metadata = {
  title: "About Us | SRIJAN Fashion",
  description: "Discover the story behind SRIJAN Fashion. Learn about our founder, our mission, and our promise to deliver premium custom designs.",
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