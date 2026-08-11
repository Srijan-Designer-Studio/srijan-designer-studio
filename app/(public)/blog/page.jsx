export const dynamic = 'force-dynamic';

import BlogHero from "@/components/blog/BlogHero";
import LatestBlogs from "@/components/blog/LatestBlogs";
import { getAllBlogs } from "@/app/actions/blogs";

export const metadata = {
  title: "Blog - Fashion Trends, Tips & Style Guides | SRIJAN Fashion",
  description: "Read our blogs for insights on latest fashion trends, styling tips, outfit ideas and expert insights to help you discover new styles and dress with confidence.",
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