"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const initialReviews = [
  {
    id: 1,
    name: "Ananya Mehta",
    role: "Fashion Designer, Mumbai",
    review: `"Srijan completely changed the way I look at custom ethnic wear. The detailing, fitting, and finishing were absolutely beautiful."`,
    rating: 4.8,
    imageSrc: "https://i.pravatar.cc/150?img=47",
    placeholderBg: "bg-[#d4a373]",
  },
  {
    id: 2,
    name: "Aarav Kapoor",
    role: "Entrepreneur, Delhi",
    review: `"I wanted something traditional but with a modern touch, and Srijan delivered exactly that. The final outfit looked even better than I imagined."`,
    rating: 4.5,
    imageSrc: "https://i.pravatar.cc/150?img=12",
    placeholderBg: "bg-[#9ca3af]",
  },
  {
    id: 3,
    name: "Riya Banerjee",
    role: "Content Creator, Kolkata",
    review: `"The entire experience was so smooth, from choosing the fabric to the final fitting. My saree looked elegant, premium, and truly unique."`,
    rating: 5,
    imageSrc: "https://i.pravatar.cc/150?img=32",
    placeholderBg: "bg-[#64748b]",
  },
  {
    id: 4,
    name: "Aditya Sharma",
    role: "Business Consultant, Bengaluru",
    review: `"I ordered a custom kurta set for a family function and received so many compliments. The craftsmanship and fitting were exceptional."`,
    rating: 4.3,
    imageSrc: "https://i.pravatar.cc/150?img=68",
    placeholderBg: "bg-[#d4a373]",
  },
  {
    id: 5,
    name: "Sneha Iyer",
    role: "Architect, Chennai",
    review: `"What impressed me most was the attention to detail. Every element felt thoughtfully designed, and the final outfit was absolutely stunning."`,
    rating: 4.7,
    imageSrc: "https://i.pravatar.cc/150?img=25",
    placeholderBg: "bg-[#9ca3af]",
  },
  {
    id: 6,
    name: "Kunal Agarwal",
    role: "Startup Founder, Hyderabad",
    review: `"Finding premium ethnic wear that actually fits perfectly is difficult. Srijan made the entire process effortless and the result was worth every penny."`,
    rating: 4.5,
    imageSrc: "https://i.pravatar.cc/150?img=11",
    placeholderBg: "bg-[#64748b]",
  },
  {
    id: 7,
    name: "Ishita Roy",
    role: "Marketing Professional, Kolkata",
    review: `"My custom saree was exactly what I had envisioned. The fabric, colour combination, and finishing made it feel incredibly special."`,
    rating: 4.8,
    imageSrc: "https://i.pravatar.cc/150?img=44",
    placeholderBg: "bg-[#d4a373]",
  },
  {
    id: 8,
    name: "Vikram Singh",
    role: "Corporate Executive, Jaipur",
    review: `"Srijan blends traditional Indian craftsmanship with contemporary styling beautifully. My outfit was sophisticated, comfortable, and perfectly tailored."`,
    rating: 4.2,
    imageSrc: "https://i.pravatar.cc/150?img=56",
    placeholderBg: "bg-[#9ca3af]",
  },
  {
    id: 9,
    name: "Meera Nair",
    role: "Interior Designer, Pune",
    review: `"From the first consultation to the final delivery, everything felt premium and personalised. I absolutely loved how my outfit turned out."`,
    rating: 4.6,
    imageSrc: "https://i.pravatar.cc/150?img=49",
    placeholderBg: "bg-[#64748b]",
  },
  {
    id: 10,
    name: "Rohan Malhotra",
    role: "Photographer, Chandigarh",
    review: `"The craftsmanship is genuinely impressive. The outfit looked elegant in person and even better in photographs. Definitely coming back for my next occasion."`,
    rating: 5,
    imageSrc: "https://i.pravatar.cc/150?img=5",
    placeholderBg: "bg-[#d4a373]",
  },
  {
    id: 11,
    name: "Nandini Chatterjee",
    role: "HR Manager, Kolkata",
    review: `"I loved how beautifully Srijan understood my vision and turned it into reality. The outfit felt elegant, comfortable, and completely personal."`,
    rating: 4.5,
    imageSrc: "https://i.pravatar.cc/150?img=29",
    placeholderBg: "bg-[#c08457]",
  },
  {
    id: 12,
    name: "Manav Patel",
    role: "Business Owner, Ahmedabad",
    review: `"The quality of the fabric and finishing was excellent. It looked premium without losing the traditional Indian character I wanted."`,
    rating: 4.3,
    imageSrc: "https://i.pravatar.cc/150?img=15",
    placeholderBg: "bg-[#78716c]",
  },
  {
    id: 13,
    name: "Tanya Kapoor",
    role: "Stylist, New Delhi",
    review: `"Every little detail was beautifully executed. The final piece had such a sophisticated look and fit me perfectly."`,
    rating: 4.8,
    imageSrc: "https://i.pravatar.cc/150?img=45",
    placeholderBg: "bg-[#a8a29e]",
  },
  {
    id: 14,
    name: "Sourav Das",
    role: "Software Engineer, Bengaluru",
    review: `"I was looking for something simple yet stylish for a wedding, and Srijan got the balance exactly right. The fitting was fantastic."`,
    rating: 4.2,
    imageSrc: "https://i.pravatar.cc/150?img=60",
    placeholderBg: "bg-[#475569]",
  },
  {
    id: 15,
    name: "Kavya Reddy",
    role: "Marketing Manager, Hyderabad",
    review: `"The design consultation made the whole experience feel personal. My outfit was elegant, modern, and still had that beautiful traditional touch."`,
    rating: 4.7,
    imageSrc: "https://i.pravatar.cc/150?img=36",
    placeholderBg: "bg-[#d6a77a]",
  },
  {
    id: 16,
    name: "Arjun Verma",
    role: "Photographer, Lucknow",
    review: `"I received compliments throughout the evening. The craftsmanship is impressive, and the outfit looked incredibly refined."`,
    rating: 4.5,
    imageSrc: "https://i.pravatar.cc/150?img=52",
    placeholderBg: "bg-[#64748b]",
  },
  {
    id: 17,
    name: "Pooja Mukherjee",
    role: "Teacher, Bhubaneswar",
    review: `"The saree I received was even more beautiful than the reference design. The colour, embroidery, and finishing were simply perfect."`,
    rating: 5,
    imageSrc: "https://i.pravatar.cc/150?img=23",
    placeholderBg: "bg-[#b08968]",
  },
  {
    id: 18,
    name: "Yash Thakur",
    role: "Investment Analyst, Mumbai",
    review: `"Srijan made choosing a custom outfit surprisingly easy. The attention to detail and personalised service really stood out."`,
    rating: 4.4,
    imageSrc: "https://i.pravatar.cc/150?img=3",
    placeholderBg: "bg-[#6b7280]",
  },
  {
    id: 19,
    name: "Diya Srinivasan",
    role: "Fashion Blogger, Chennai",
    review: `"The outfit was beautifully designed and photographed amazingly well. It felt luxurious, comfortable, and completely unique."`,
    rating: 4.8,
    imageSrc: "https://i.pravatar.cc/150?img=41",
    placeholderBg: "bg-[#d4a373]",
  },
  {
    id: 20,
    name: "Kabir Joshi",
    role: "Marketing Consultant, Pune",
    review: `"From the fabric selection to the final fitting, everything was handled professionally. The final outfit exceeded my expectations."`,
    rating: 4.6,
    imageSrc: "https://i.pravatar.cc/150?img=67",
    placeholderBg: "bg-[#52525b]",
  },
];

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#ff8c00]">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export default function Testimonials() {
  const containerRef = useRef(null);
  const [reviews, setReviews] = useState(initialReviews);

  const groupedReviews = [];
  for (let i = 0; i < reviews.length; i += 2) {
    groupedReviews.push(reviews.slice(i, i + 2));
  }

  useGSAP(() => {
    const container = containerRef.current;
    const cardsContainer = container.querySelector(".cards-container");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${groupedReviews.length * 70}%`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(".bg-text-wrapper", {
      scale: 0.85,
      opacity: 0.2,
      y: -50,
      ease: "none",
    }, 0);

    tl.fromTo(cardsContainer, {
      y: () => window.innerHeight,
    }, {
      y: () => -(cardsContainer.offsetHeight + 100),
      ease: "none",
    }, 0);
  }, { scope: containerRef, dependencies: [reviews.length] });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-white overflow-hidden">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0 px-4">
        <div className="bg-text-wrapper flex flex-col items-start -mt-20 lg:-mt-10">
          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-normal text-gray-400 tracking-tighter leading-[0.9] opacity-80">
            What Customers
          </h2>
          <h2 className="text-[clamp(3.5rem,10vw,9rem)] font-bold text-black tracking-tighter leading-[0.9] ml-12 md:ml-32">
            are saying
          </h2>
        </div>
      </div>

      <div className="cards-container absolute top-[10vh] left-0 right-0 z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col pb-[20vh]">
        {groupedReviews.map((group, groupIndex) => {
          const alignmentClass = groupIndex % 2 === 0 ? "self-start" : "self-end";

          return (
            <div key={groupIndex} className={`flex flex-col md:flex-row gap-6 md:gap-10 w-full lg:w-[85%] mb-[12vh] ${alignmentClass}`}>
              {group.map((item) => (
                <div
                  key={item.id}
                  className="flex-1 w-full bg-white/90 backdrop-blur-md p-6 lg:p-8 rounded-[24px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 will-change-transform"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
                      {item.imageSrc ? (
                        <Image src={item.imageSrc} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className={`w-full h-full ${item.placeholderBg} flex items-center justify-center`}>
                          <span className="text-white text-sm font-bold uppercase">
                            {item.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-[16px] font-bold text-black leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-[19px] text-gray-500 mt-0.5">{item.role}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  <p className="text-gray-800 text-[15px] leading-[1.7] font-medium">
                    {item.review}
                  </p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}