"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Date Formatter Function
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function LatestBlogs({ blogs = [] }) {
  const containerRef = useRef(null);
  
  // Slider States
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerView(1); // Mobile
      else if (window.innerWidth < 1024) setItemsPerView(2); // Tablet
      else setItemsPerView(3); // Desktop
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil((blogs?.length || 0) / itemsPerView);

  useEffect(() => {
    if (totalPages <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 3500); 
    
    return () => clearInterval(interval);
  }, [totalPages, isPaused]);


  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".latest-head",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

    if (blogs && blogs.length > 0) {
      tl.fromTo(
        ".latest-card",
        { y: 60, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power4.out" },
        "-=0.4"
      ).fromTo(
        ".latest-pagination",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    } else {
      tl.fromTo(
        ".empty-msg",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }
  }, { scope: containerRef, dependencies: [blogs] });

  return (
    <section className="py-20 bg-white min-h-[50vh] flex flex-col overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6 w-full flex-1 flex flex-col">
        
        <div className="mb-12">
          <h2 className="latest-head text-3xl md:text-4xl font-bold text-center text-black">
            Latest Blogs
          </h2>
        </div>

        {blogs && blogs.length > 0 ? (
          <>
            {/* Slider Container */}
            <div 
              className="relative overflow-hidden mb-10 -mx-3 lg:-mx-4 px-3 lg:px-4 py-4 -my-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {blogs.map((blog) => (
                  <div 
                    key={blog.id} 
                    className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3 lg:px-4"
                  >
                    <div className="latest-card border border-[#00c3ff]/40 rounded-xl p-4 bg-white hover:shadow-lg transition-all group flex flex-col h-full">
                      <Link href={`/blog/${blog.slug}`} className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-5 bg-gray-100">
                        <img
                          src={blog.image_url || "/images/placeholder.jpg"}
                          alt={blog.title}
                          
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-top object-cover group-hover:scale-105 transition-transform duration-500"
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
                          <span>{formatDate(blog.created_at)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-[#00c3ff] font-bold text-[14px] flex items-center gap-1 hover:text-[#00abe0] transition-colors w-max"
                      >
                        Read More <ArrowUpRight size={16} strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Pagination Buttons */}
            {totalPages > 1 && (
              <div className="latest-pagination flex justify-center items-center gap-3">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                      currentPage === idx 
                        ? "w-10 bg-[#00c3ff]" 
                        : "w-6 bg-[#00c3ff]/30 hover:bg-[#00c3ff]/60"
                    }`}
                  ></div>
                ))}
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