import BlogHero from "@/components/blog/BlogHero";
import LatestBlogs from "@/components/blog/LatestBlogs";
import { getBlogs } from "@/app/actions/blog";

export const metadata = {
  title: "Our Blogs | SRIJAN Fashion",
  description: "Stay updated with the latest fashion styles, styling guides and trend insights.",
};

export default async function BlogPage() {
  // Fetch real blog posts from the database
  const blogs = await getBlogs();

  return (
    <main>
      <BlogHero />
      {/* Pass the real database records to your existing component */}
      <LatestBlogs blogs={blogs} />
    </main>
  );
}