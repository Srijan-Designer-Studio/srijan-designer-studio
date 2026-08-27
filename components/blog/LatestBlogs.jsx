"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { User, Calendar, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function LatestBlogs({ blogs = [] }) {
  const containerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const totalPages = Math.ceil((blogs?.length || 0) / itemsPerPage);
  const currentBlogs = blogs?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (containerRef.current) {
      const yOffset = containerRef.current.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
    }
  };

  useGSAP(() => {
    gsap.fromTo(
      ".latest-head",
      { y: 40, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    if (currentBlogs.length > 0) {
      gsap.fromTo(
        ".latest-card",
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "power4.out" }
      );
      gsap.fromTo(
        ".latest-pagination",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    } else {
      gsap.fromTo(
        ".empty-msg",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, { scope: containerRef, dependencies: [currentPage, blogs] });

  return (
    <section className="py-20 bg-white min-h-[50vh] flex flex-col overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 w-full flex-1 flex flex-col">
        <div className="mb-12">
          <h2 className="latest-head text-3xl md:text-4xl font-bold text-center text-black">
            Latest Blogs
          </h2>
        </div>

        {currentBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {currentBlogs.map((blog) => (
                <div key={blog.id} className="latest-card border border-[#00c3ff]/40 rounded-xl p-4 bg-white hover:shadow-lg transition-all group flex flex-col h-full">
                  <Link href={`/blog/${blog.slug}`} className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-5 bg-gray-100">
                    <img
                      src={blog.image_url || "/images/placeholder.jpg"}
                      alt={blog.title}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-top object-cover group-hover:scale-105 transition-transform duration-500 w-full h-full"
                    />
                  </Link>

                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-[17px] font-bold text-gray-900 mb-4 leading-snug line-clamp-2 hover:text-[#00c3ff] transition-colors">
                      {blog.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-6 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-[#00c3ff]" />
                      <span>{blog.author || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#00c3ff]" />
                      <span>{formatDate(blog.published_at || blog.created_at)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="group inline-flex items-center justify-center gap-1.5 bg-[#00c3ff] hover:bg-[#00abe0] text-white  text-sm md:text-base px-1 py-1 md:px-4 md:py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#00c3ff]/40 hover:-translate-y-1 w-fit"
                  >
                    Read More
                    <ArrowUpRight
                      size={20}
                      strokeWidth={2.5}
                      className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="latest-pagination flex justify-center items-center gap-3">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:bg-[#00c3ff] hover:text-white hover:border-[#00c3ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                      currentPage === idx + 1
                        ? 'bg-[#00c3ff] text-white shadow-md'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-[#00c3ff]/10 hover:text-[#00c3ff] hover:border-[#00c3ff]/30'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:bg-[#00c3ff] hover:text-white hover:border-[#00c3ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-msg flex-1 flex items-center justify-center text-gray-500 py-10">
            <p className="text-lg">No blogs found. Check back later!</p>
          </div>
        )}
      </div>
    </section>
  );
}