import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    category: "Western",
    title: "Trendy Mom Jeans Styles for Hot Indian Days | Srijan Fashion",
    imageSrc: "/images/western1.png", 
    placeholderBg: "bg-[#94a3b8]", 
  },
  {
    id: 2,
    category: "Western",
    title: "Top Fabrics That Make Outfits for Plus Size More Comfortable | Srijan Fashion",
    imageSrc: "/images/western6.png", 
    placeholderBg: "bg-[#cbd5e1]", 
  },
];

export default function Blogs() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2b2d56] via-[#484a70] to-[#7a7c99]">
      <div className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Text and Button */}
          <div className="lg:col-span-4 flex flex-col items-start max-w-[400px]">
            {/* Red Subheading */}
            <span className="text-[#ff3838] font-bold uppercase tracking-wider text-sm mb-4 block">
              BLOGS
            </span>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-[1.3] mb-8">
              Dive Into SRIJAN Styles & Tips
            </h2>

            {/* Cyan Button */}
            <Link
              href="/blogs"
              className="
                inline-flex 
                items-center 
                gap-2 
                bg-[#00c3ff] 
                hover:bg-[#00abe0] 
                text-white 
                font-bold 
                text-[15px] 
                px-8 
                py-3.5 
                rounded-full 
                transition-all 
                duration-300 
                shadow-md
                hover:shadow-lg
                hover:-translate-y-0.5
              "
            >
              View All Blogs
              <ArrowRight size={18} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Right Side: Blog Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogPosts.map((post) => (
              <Link 
                href={`/blog/${post.id}`} 
                key={post.id} 
                className="bg-white rounded-[24px] p-3 sm:p-4 shadow-xl group hover:-translate-y-1 transition-transform duration-300 flex flex-col"
              >
                
                {/* Blog Image */}
                <div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden mb-5">
                  {post.imageSrc ? (
                    <Image
                      src={post.imageSrc}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`w-full h-full ${post.placeholderBg} flex items-center justify-center`}>
                      <span className="text-white/80 font-bold tracking-widest bg-black/20 px-4 py-2 rounded-lg text-xs uppercase">
                        BLOG IMAGE
                      </span>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="px-2 pb-2 flex-1 flex flex-col">
                  {/* Category */}
                  <span className="text-[#0070f3] text-sm font-semibold mb-2 block">
                    {post.category}
                  </span>
                  
                  {/* Title */}
                  <h3 className="text-[#111] text-base lg:text-[17px] font-bold leading-snug">
                    {post.title}
                  </h3>
                </div>

              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}