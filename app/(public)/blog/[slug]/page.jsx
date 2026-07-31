import { getBlogBySlug } from "@/app/actions/blogs";
import BlogClient from "./BlogClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The requested blog post could not be found."
    };
  }

  return {
    title: blog.meta_title || blog.title,
    description: blog.meta_description || "Read this amazing blog post on Srijan Fashion.",
    keywords: blog.keywords || "srijan fashion, fashion blog, trending clothes",
    alternates: {
      canonical: `https://srijandesignerstudio.com/blog/${slug}`,
    }
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description,
      images: [blog.image_url || "/images/default-blog.png"]
    }
  };
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return <BlogClient blog={blog} />;
}