"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function BlogClient({ blog }) {
  const [headings, setHeadings] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const contentRef = useRef(null);
  const headingRefsMap = useRef([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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

  const publishDate = new Date(blog.published_at || blog.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-20 text-black">
      <nav className="flex items-center gap-2 text-[13px] text-gray-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#00c3ff] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-[#00c3ff] transition-colors">Blog</Link>
        {blog.categories?.name && (
          <>
            <span>/</span>
            <span className="text-gray-700">{blog.categories.name}</span>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{blog.title}</span>
      </nav>

      <h1 className="text-3xl md:text-5xl font-extrabold mt-2 mb-5 text-center text-gray-900 leading-tight">
        {blog.title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-500 mb-10">
        <span className="font-bold text-gray-800 tracking-wide uppercase text-[12px]">
          By {blog.author || "Admin"}
        </span>
        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
        <span className="font-medium">{publishDate}</span>
      </div>

      {blog.image_url && (
        <div className="relative w-full h-[300px] md:h-[450px] lg:h-[550px] mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={blog.image_url}
            alt={blog.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {headings.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28 self-start bg-[#f9fbfc] p-6 rounded-2xl border border-blue-50/50 shadow-sm">
            <p className="text-[13px] font-extrabold uppercase tracking-widest text-black mb-5">
              On this page
            </p>
            <nav className="flex flex-col gap-2.5">
              {headings.map((text, index) => (
                <button
                  key={index}
                  onClick={() => scrollToHeading(index)}
                  className={`
                    text-left text-[14px] px-3.5 py-2.5 rounded-xl transition-all duration-200
                    border-l-[3px] cursor-pointer outline-none leading-snug font-medium
                    ${activeIndex === index
                      ? "border-[#00c3ff] bg-white text-[#00c3ff] shadow-sm"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white"
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
          className="prose prose-lg max-w-none w-full prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#00c3ff] hover:prose-a:text-[#009bcc] prose-img:rounded-2xl prose-img:shadow-md prose-table:border-collapse prose-th:border prose-td:border prose-th:border-gray-200 prose-td:border-gray-200 prose-th:bg-gray-50"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}