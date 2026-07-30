// app/(public)/blog/[slug]/page.jsx
"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { getBlogBySlug } from "@/app/actions/blogs";

export default function BlogDetails({ params }) {
  const { slug } = use(params);
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [headings, setHeadings] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef(null);
  const headingRefsMap = useRef([]);

  useEffect(() => {
    const fetchBlog = async () => {
      const data = await getBlogBySlug(slug);
      setBlog(data);
      setLoading(false);
    };
    fetchBlog();
  }, [slug]);

  useEffect(() => {
    if (!blog?.content || !contentRef.current) return;

    const h2Elements = Array.from(contentRef.current.querySelectorAll("h2"));
    headingRefsMap.current = h2Elements;
    setHeadings(h2Elements.map((el) => el.textContent.trim()));
  }, [blog]);

  useEffect(() => {
    if (!headingRefsMap.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = headingRefsMap.current.indexOf(entry.target);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    headingRefsMap.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (index) => {
    const el = headingRefsMap.current[index];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!blog) return <div className="text-center py-20">Blog not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-20 text-black">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-indigo-600 transition-colors">Blog</Link>
        {blog.categories?.name && (
          <>
            <span>/</span>
            <span className="text-gray-700">{blog.categories.name}</span>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[300px]">{blog.title}</span>
      </nav>

      <h1 className="text-4xl font-bold mt-2 mb-6 text-center">{blog.title}</h1>
      
      {blog.image_url && (
        <div className="relative w-full h-[400px] mb-10 rounded-xl overflow-hidden shadow-md">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {headings.length > 0 && (
          <aside className="hidden lg:block w-60 shrink-0 sticky top-24 self-start bg-gray-50 p-5 rounded-xl border border-gray-100">
            <p className="text-xs font-bold uppercase tracking-widest text-black mb-4">
              On this page
            </p>
            <nav className="flex flex-col gap-2">
              {headings.map((text, index) => (
                <button
                  key={index}
                  onClick={() => scrollToHeading(index)}
                  className={`
                    text-left text-sm px-3 py-2 rounded-md transition-all duration-150
                    border-l-2 cursor-pointer outline-none
                    ${
                      activeIndex === index
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }
                  `}
                >
                  {text}
                </button>
              ))}
            </nav>
          </aside>
        )}

        <div
          ref={contentRef}
          className="
            flex-1 min-w-0
            prose prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-indigo-600 prose-a:underline hover:prose-a:text-indigo-800
            prose-img:rounded-xl prose-img:shadow-md
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}