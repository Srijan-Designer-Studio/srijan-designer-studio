export const dynamic = 'force-dynamic';

import BlogHero from "@/components/blog/BlogHero";
import LatestBlogs from "@/components/blog/LatestBlogs";
import { getAllBlogs } from "@/app/actions/blogs";

export const metadata = {
  title: "Our Blogs | SRIJAN Fashion",
  description: "Stay updated with the latest fashion styles, styling guides and trend insights.",
};

export default async function BlogPage() {
 
  const blogs = await getAllBlogs();

  return (
    <main>
      <BlogHero />
      <LatestBlogs blogs={blogs} />
    </main>
  );
}