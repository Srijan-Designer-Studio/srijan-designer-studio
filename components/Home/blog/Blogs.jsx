"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getAllBlogs } from "@/app/actions/blogs";

gsap.registerPlugin(ScrollTrigger);

export default function Blogs() {
  const containerRef = useRef(null);
  const marqueeRef = useRef(null);
  const tweenRef = useRef(null);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getAllBlogs(); 
        if (data && data.length > 0) {
          setBlogPosts(data.slice(0, 6)); 
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogs();
  }, []);

  useGSAP(() => {
    if (blogPosts.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".blog-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
    );

    tweenRef.current = gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 30,
      repeat: -1,
    });

  }, { scope: containerRef, dependencies: [blogPosts] }); 

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.play();

  return (
    <section className="py-20 bg-gradient-to-br from-[#2b2d56] via-[#484a70] to-[#7a7c99] overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          <div className="lg:col-span-4 flex flex-col items-start max-w-[400px] z-10">
            <h2 className="blog-text text-[#ff3838] font-bold uppercase tracking-wider text-sm mb-4 block">
              BLOGS
            </h2>

            <h3 className="blog-text text-2xl sm:text-4xl lg:text-[40px] font-bold text-white leading-[1.3] mb-8">
              Dive Into SRIJAN Styles & Tips
            </h3>

            <div className="blog-text inline-block">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                View All Blogs
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div 
            className="lg:col-span-8 overflow-hidden relative cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <div ref={marqueeRef} className="flex w-max">
              
              <div className="flex gap-6 pr-6">
                {blogPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug || post.id}`} 
                    key={`first-${post.id}`}
                    className="blog-card bg-white rounded-[24px] p-3 sm:p-4 shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col w-[280px] sm:w-[350px] shrink-0"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-5">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover object-top transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#cbd5e1] flex items-center justify-center">
                          <span className="text-white/80 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-xs uppercase">
                            BLOG IMAGE
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-2 pb-2 flex-1 flex flex-col">
                      <span className="text-[#0070f3] text-sm font-semibold mb-2 block">
                        {post.categories?.name || "Fashion"}
                      </span>
                      <h3 className="text-[#111] text-base lg:text-[17px] font-bold leading-snug whitespace-normal">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex gap-6 pr-6">
                {blogPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug || post.id}`} 
                    key={`second-${post.id}`}
                    className="blog-card bg-white rounded-[24px] p-3 sm:p-4 shadow-xl hover:-translate-y-1 transition-transform duration-300 flex flex-col w-[280px] sm:w-[350px] shrink-0"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-5">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover object-top transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#cbd5e1] flex items-center justify-center">
                          <span className="text-white/80 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-xs uppercase">
                            BLOG IMAGE
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-2 pb-2 flex-1 flex flex-col">
                      <span className="text-[#0070f3] text-sm font-semibold mb-2 block">
                        {post.categories?.name || "Fashion"}
                      </span>
                      <h3 className="text-[#111] text-base lg:text-[17px] font-bold leading-snug whitespace-normal">
                        {post.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}