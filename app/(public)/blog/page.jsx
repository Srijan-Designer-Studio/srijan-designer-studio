import BlogHero from "@/components/blog/BlogHero";
import LatestBlogs from "@/components/blog/LatestBlogs";

export const metadata = {
  title: "Our Blogs | SRIJAN Fashion",
  description: "Stay updated with the latest fashion styles, styling guides and trend insights.",
};

export default function BlogPage() {
  return (
    <main>
      <BlogHero />
      <LatestBlogs />
    </main>
  );
}
