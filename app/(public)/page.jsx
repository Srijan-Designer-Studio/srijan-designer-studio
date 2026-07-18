

import Hero from "@/components//Home/Hero/Hero";
import AboutIntro from "@/components/Home/about/About";
import Collection from "@/components/Home/collection/Collection";
import ShopEssentials from "@/components/Home/ShopEssentials/ShopEssentials";
import CustomizeWear from "@/components/Home/customizeWear/CustomizeWear";
import CustomizeWedding from "@/components/Home/customizeWedding/CustomizeWedding";
import CustomizeKidsWear from "@/components/Home/customizeKidsWear/CustomizeKidsWear";
import Blogs from "@/components/Home/blog/Blogs";
import Testimonials from "@/components/Home/testimonials/Testimonials";
import FAQ from "@/components/Home/faq/FAQ";

export default function Home() {
  return (
    <>
   
    <Hero/>
    <AboutIntro />
    <Collection/>    
    <ShopEssentials/> 
    <CustomizeWear/>
    <CustomizeWedding/>
    <CustomizeKidsWear/>
    <Blogs />
    <Testimonials/>
    <FAQ/>
    </>
  );
}
