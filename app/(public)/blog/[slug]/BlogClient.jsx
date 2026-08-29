"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function BlogClient({ blog }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState("");
  const contentRef = useRef(null);
  const isClickScrolling = useRef(false);
  const clickScrollTimeout = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!blog?.content || !contentRef.current) return;

    const elements = Array.from(contentRef.current.querySelectorAll("h2, h3"));
    const usedIds = new Map();

    const newHeadings = elements.map((el) => {
      const text = el.textContent.trim();
      let id = slugify(text) || "section";
    
      if (usedIds.has(id)) {
        const count = usedIds.get(id) + 1;
        usedIds.set(id, count);
        id = `${id}-${count}`;
      } else {
        usedIds.set(id, 1);
      }

      el.id = id;
      el.style.scrollMarginTop = "110px";
      return { id, text };
    });

    setHeadings(newHeadings);
  }, [blog]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        
        if (isClickScrolling.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    return () => clearTimeout(clickScrollTimeout.current);
  }, []);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    isClickScrolling.current = true;
    setActiveId(id);
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    clearTimeout(clickScrollTimeout.current);
    clickScrollTimeout.current = setTimeout(() => {
      isClickScrolling.current = false;
    }, 900);
  };

  const publishDate = new Date(blog.published_at || blog.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-20 text-black">
      <nav className="flex flex-wrap items-center gap-2 text-[13px] text-gray-500 mb-6 font-medium">
        <Link href="/" className="hover:text-[#00c3ff] transition-colors shrink-0">Home</Link>
        <span className="shrink-0">/</span>
        <Link href="/blog" className="hover:text-[#00c3ff] transition-colors shrink-0">Blog</Link>
        {blog.categories?.name && (
          <>
            <span className="shrink-0">/</span>
            <span className="text-gray-700 shrink-0">{blog.categories.name}</span>
          </>
        )}
        <span className="shrink-0">/</span>
        <span className="text-gray-900 truncate max-w-[150px] sm:max-w-[200px] md:max-w-[300px]">{blog.title}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mt-2 mb-5 text-center text-gray-900 leading-tight">
        {blog.title}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-gray-500 mb-8 sm:mb-10">
        <span className="font-bold text-gray-800 tracking-wide uppercase text-[11px] sm:text-[12px]">
          By {blog.author || "Admin"}
        </span>
        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
        <span className="font-medium">{publishDate}</span>
      </div>

      {blog.image_url && (
        <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] mb-8 sm:mb-12 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <img
            src={blog.image_url}
            alt={blog.cover_img_alt || blog.title}
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
        {headings.length > 0 && (
          <aside className="w-full lg:w-64 shrink-0 lg:sticky top-28 self-start bg-[#f9fbfc] p-5 sm:p-6 rounded-2xl border border-blue-50/50 shadow-sm z-10">
            <p className="text-[12px] sm:text-[13px] font-extrabold uppercase tracking-widest text-black mb-4 sm:mb-5">
              On this page
            </p>
            <nav className="flex flex-col max-h-[250px] lg:max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar gap-2 sm:gap-2.5 pr-2 lg:pr-0">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => handleScroll(heading.id)}
                  className={`
                    text-left text-[13px] sm:text-[14px] px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all duration-200
                    border-l-[3px] cursor-pointer outline-none leading-snug font-medium shrink-0
                    ${activeId === heading.id
                      ? "border-[#00c3ff] bg-white text-[#00c3ff] shadow-sm"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-white"
                    }
                  `}
                >
                  {heading.text}
                </button>
              ))}
            </nav>
          </aside>
        )}

        <div
          ref={contentRef}
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none w-full prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-[#00c3ff] hover:prose-a:text-[#009bcc] prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-md prose-table:border-collapse prose-th:border prose-td:border prose-th:border-gray-200 prose-td:border-gray-200 prose-th:bg-gray-50"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}