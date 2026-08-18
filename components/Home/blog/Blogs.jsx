"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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

    // Title Entrance Animation
    gsap.fromTo(
      ".blog-text",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      }}
    );

    // Step Scroll Animation (2s pause, 1s slide) for ALL screens
    const marqueeTl = gsap.timeline({ repeat: -1 });
    const totalCards = blogPosts.length;
    
    // Calculates exact width percentage to shift per card (50% is the halfway mark due to duplicated array)
    const stepPercentage = 50 / totalCards; 

    for (let i = 1; i <= totalCards; i++) {
      marqueeTl.to(marqueeRef.current, {
        xPercent: -(stepPercentage * i),
        duration: 0.8, // Slide speed
        ease: "power2.inOut"
      }, "+=2"); // Wait 2 seconds before every slide
    }
    
    tweenRef.current = marqueeTl;

  }, { scope: containerRef, dependencies: [blogPosts] }); 

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.play();

  return (
    <section className="py-20 bg-gradient-to-br from-[#2b2d56] via-[#484a70] to-[#7a7c99] overflow-hidden" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Text Content */}
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

          {/* Marquee Section (Masking edges adjusted slightly to fit 2 cards perfectly) */}
          <div 
            className="lg:col-span-8 overflow-hidden relative cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] py-8"
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
          >
            <div ref={marqueeRef} className="flex w-max">
              
              {/* First Set of Cards */}
              <div className="flex gap-6 pr-6">
                {blogPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug || post.id}`} 
                    key={`first-${post.id}`}
                    // Width updated: w-[82vw] for mobile (1 card), lg:w-[400px] for desktop (Exactly 2 cards)
                    className="blog-card bg-[#18263a] rounded-[24px] p-4 shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col w-[82vw] sm:w-[350px] lg:w-[400px] shrink-0 border border-white/5 group"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-5">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-white/50 font-bold tracking-widest bg-black/30 px-4 py-2 rounded-lg text-xs uppercase">
                            BLOG IMAGE
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-1 pb-1 flex-1 flex flex-col">
                      {post.categories?.name && (
                        <span className="text-gray-400 text-[13px] font-semibold mb-2 block uppercase tracking-wider">
                          {post.categories.name}
                        </span>
                      )}
                      
                      <h3 className="text-white text-base lg:text-[19px] font-bold leading-[1.4] whitespace-normal pr-2">
                        {post.title}
                      </h3>

                      <div className="mt-6 pt-2 pb-1">
                        <div className="w-[45px] h-[45px] rounded-full bg-[#00c3ff] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00a8e0] transition-all shadow-lg shadow-[#00c3ff]/20">
                          <ArrowUpRight size={22} strokeWidth={2.5} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Second Set of Cards (Duplicate for Seamless Loop) */}
              <div className="flex gap-6 pr-6">
                {blogPosts.map((post) => (
                  <Link
                    href={`/blog/${post.slug || post.id}`} 
                    key={`second-${post.id}`}
                    // Width updated: w-[82vw] for mobile (1 card), lg:w-[400px] for desktop (Exactly 2 cards)
                    className="blog-card bg-[#18263a] rounded-[24px] p-4 shadow-2xl hover:-translate-y-3 transition-all duration-300 flex flex-col w-[82vw] sm:w-[350px] lg:w-[400px] shrink-0 border border-white/5 group"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-5">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <span className="text-white/50 font-bold tracking-widest bg-black/30 px-4 py-2 rounded-lg text-xs uppercase">
                            BLOG IMAGE
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="px-1 pb-1 flex-1 flex flex-col">
                      {post.categories?.name && (
                        <span className="text-gray-400 text-[13px] font-semibold mb-2 block uppercase tracking-wider">
                          {post.categories.name}
                        </span>
                      )}
                      
                      <h3 className="text-white text-base lg:text-[19px] font-bold leading-[1.4] whitespace-normal pr-2">
                        {post.title}
                      </h3>

                      <div className="mt-6 pt-2 pb-1">
                        <div className="w-[45px] h-[45px] rounded-full bg-[#00c3ff] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00a8e0] transition-all shadow-lg shadow-[#00c3ff]/20">
                          <ArrowUpRight size={22} strokeWidth={2.5} className="text-white" />
                        </div>
                      </div>
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