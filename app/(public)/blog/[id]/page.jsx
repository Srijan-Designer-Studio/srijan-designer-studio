export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import RelatedBlogs from "@/components/blog/RelatedBlogs";
import { getBlogBySlug } from "@/app/actions/blog";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.id);
  
  if (!blog) return { title: "Blog Not Found" };
  return { title: `${blog.title} | SRIJAN Fashion` };
}

export default async function SingleBlogPage({ params }) {
  // Await the params object (Required in Next.js 15+)
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Fetch the specific blog post
  const blog = await getBlogBySlug(id);

  if (!blog) {
    return notFound();
  }

  const formattedDate = new Intl.DateTimeFormat('en-IN', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }).format(new Date(blog.created_at));

  return (
    <main className="bg-white">
      <section className="max-w-[900px] mx-auto px-6 pt-10 pb-16">
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 bg-gray-100 border border-gray-200 shadow-sm">
          <Image 
            src={blog.image_url || "/images/placeholder.jpg"} 
            alt={blog.title} 
            fill 
            className="object-cover" 
          />
        </div>
        
        <h1 className="text-3xl md:text-[42px] font-bold text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>
        
        <div className="flex items-center gap-2 text-[#00c3ff] font-medium mb-10">
          <Calendar size={18} />
          <span>{formattedDate}</span>
        </div>

        {/* Dynamic Rich Text Content Rendered Safely */}
        <div 
          className="text-[17px] text-gray-600 leading-[1.8] space-y-6 blog-content-wrapper"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

      </section>

      {/* Assuming you update RelatedBlogs to fetch or accept a category/tags prop */}
      <RelatedBlogs currentBlogId={blog.id} />
    </main>
  );
}