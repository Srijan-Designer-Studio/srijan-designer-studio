export const dynamic = 'force-dynamic';

import Hero from "@/components/Home/Hero/Hero";
import AboutIntro from "@/components/Home/about/About";
import Collection from "@/components/Home/collection/Collection";
import ShopEssentials from "@/components/Home/ShopEssentials/ShopEssentials";
import CustomizeWear from "@/components/Home/customizeWear/CustomizeWear";
import CustomizeWedding from "@/components/Home/customizeWedding/CustomizeWedding";
import CustomizeKidsWear from "@/components/Home/customizeKidsWear/CustomizeKidsWear";
import Blogs from "@/components/Home/blog/Blogs";
import Testimonials from "@/components/Home/testimonials/Testimonials";
import FAQ from "@/components/Home/faq/FAQ";

// Import your Data Access Layer (DAL) actions
import { getProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/admin";

export default async function Home() {
  // Fetch real data simultaneously for speed
  const [categories, essentialProducts] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  return (
    <main>
      <Hero />
      <AboutIntro />
      <Collection categories={categories} />
      <ShopEssentials products={essentialProducts} />
      <CustomizeWear />
      <CustomizeWedding />
      <CustomizeKidsWear />
      <Blogs />
      <Testimonials />
      <FAQ />
    </main>
  );
}