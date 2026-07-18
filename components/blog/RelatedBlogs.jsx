"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Calendar, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const relatedBlogs = Array(3).fill({
  title: "How to Build a Data-Driven Social Media Strategy (Step-by-Step Framework)",
  author: "Ayan Sarkar",
  date: "June 30, 2026",
  image: "/images/man1.png",
}).map((blog, idx) => ({
  ...blog,
  id: idx + 10,
  link: `/blog/${idx + 10}`
}));

export default function RelatedBlogs() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".related-head",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".related-card",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power4.out" },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section className="py-16 bg-[#f4f5f7]" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="overflow-hidden mb-10">
          <h2 className="related-head text-3xl font-bold text-center text-black">
            Related Blogs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {relatedBlogs.map((blog) => (
            <div key={blog.id} className="related-card border border-[#00c3ff]/40 rounded-xl p-4 bg-white hover:shadow-lg transition-all group flex flex-col h-full">
              <Link href={blog.link} className="relative w-full aspect-[16/10] rounded-lg overflow-hidden mb-5 bg-gray-100">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <Link href={blog.link}>
                <h3 className="text-[17px] font-bold text-gray-900 mb-4 leading-snug line-clamp-2 hover:text-[#00c3ff] transition-colors">
                  {blog.title}
                </h3>
              </Link>
              <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-6 mt-auto">
                <div className="flex items-center gap-1.5">
                  <User size={14} className="text-[#00c3ff]" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#00c3ff]" />
                  <span>{blog.date}</span>
                </div>
              </div>
              <Link href={blog.link} className="text-[#00c3ff] font-bold text-[14px] flex items-center gap-1 hover:text-[#00abe0] transition-colors w-max">
                Read More <ArrowUpRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}