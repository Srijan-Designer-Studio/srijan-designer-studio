import AboutHero from "@/components/About/AboutHero";
import Founder from "@/components/About/Founder";
import WhatWeDo from "@/components/About/WhatWeDo";
import AboutSrijan from "@/components/About/AboutSrijan";
import MissionVision from "@/components/About/MissionVision";
import OurPromise from "@/components/About/OurPromise";
import Faq from "@/components/Home/faq/FAQ.jsx";
import React from 'react'

const page = () => {
  return (

    <div
      className="wrapper">
      <AboutHero />
      <AboutSrijan />
      <WhatWeDo />
      <OurPromise />
      <Founder />
      <MissionVision />
      <Faq />
    </div>

  )
}

export default page