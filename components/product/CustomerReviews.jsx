"use client";

import { useRef, useState, useEffect, useTransition } from "react";
import { Star, User, Check, Loader2, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getProductReviews, addReview } from "@/app/actions/reviews";

gsap.registerPlugin(ScrollTrigger);

export default function CustomerReviews({ productId }) {
  const containerRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getProductReviews(productId);
        setReviews(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (productId) fetchReviews();
  }, [productId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);
    return () => clearTimeout(timer);
  }, [isWriting, reviews, isLoading]);

  useGSAP(() => {
    gsap.fromTo(
      ".review-head",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        }
      }
    );
  }, { scope: containerRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    startTransition(async () => {
      try {
        const response = await addReview(productId, rating, comment);

        if (response?.success) {
          setMessage(response.message);
          setIsWriting(false);
          setComment("");
          setRating(5);
          
          // নতুন রিভিউ অ্যাড হওয়ার পর অটোমেটিক লিস্ট আপডেট করার জন্য
          const newData = await getProductReviews(productId);
          setReviews(newData || []);
        } else {
          // 🔴 এই এলস (else) ব্লকটি মিসিং ছিল, যার কারণে এরর মেসেজ দেখাচ্ছিল না
          setMessage(response?.message || "Failed to submit review.");
        }
      } catch (error) {
        setMessage(error.message || "An unexpected error occurred.");
      }
    });
  };

  const getRatingCount = (starValue) => reviews.filter(r => r.rating === starValue).length;

  return (
    <section className="py-16 bg-[#f8f9fa] relative z-10" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <h2 className="review-head text-3xl font-bold text-black mb-12">Customer Reviews</h2>

        <div className="review-head flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div className="flex-1 w-full max-w-[400px]">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = getRatingCount(star);
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1 w-[100px]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < star ? "#c04f36" : "none"}
                        color="#c04f36"
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <div className="flex-1 h-3 bg-white rounded-sm overflow-hidden">
                    <div
                      className="h-full bg-[#c04f36] transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-4 text-right">
                    {count}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="w-full md:w-auto flex flex-col items-end">
            {!isWriting && (
              <button
                onClick={() => setIsWriting(true)}
                className="w-full md:w-[280px] h-[52px] bg-[#00c3ff] text-white rounded-full font-bold text-[14px] uppercase tracking-wide hover:bg-[#00a0d6] transition-colors shadow-md cursor-pointer"
              >
                Write A Review
              </button>
            )}
            {/* মেসেজ দেখানোর অংশ */}
            {message && <p className={`text-sm mt-3 font-medium ${message.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
          </div>
        </div>

        {isWriting && (
          <div className="bg-white text-black p-6 rounded-xl shadow-sm mb-12 border border-gray-100 relative">
            <button onClick={() => setIsWriting(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black cursor-pointer">
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4">Write your review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)} className="cursor-pointer">
                      <Star size={24} fill={rating >= star ? "#c04f36" : "none"} color="#c04f36" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#00c3ff] focus:outline-none"
                  placeholder="What did you like or dislike about this product?"
                ></textarea>
              </div>
              <button disabled={isPending} type="submit" className="bg-black text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2 cursor-pointer">
                {isPending && <Loader2 size={16} className="animate-spin" />}
                Submit Review
              </button>
              
              {/* ফর্মের ভেতরেও মেসেজটি দেখানোর ব্যবস্থা করা হলো যাতে কাস্টমার সহজে বুঝতে পারে */}
              {message && <p className={`text-sm mt-2 font-medium ${message.includes('submitted') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
            </form>
          </div>
        )}

        <p className="review-head text-sm text-gray-500 mb-6 font-medium">Most Recent</p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-5">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
              Loading...
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic py-10 text-center">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "#c04f36" : "none"} color="#c04f36" />
                  ))}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <User size={18} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#c04f36] rounded-full flex items-center justify-center border border-white">
                      <Check size={8} color="white" strokeWidth={4} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-black">{review.profiles?.first_name} {review.profiles?.last_name}</span>
                    <span className="text-[9px] text-white bg-[#c04f36] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
                <p className="text-[19px] text-gray-600 line-clamp-3">{review.comment}</p>
                <p className="text-[10px] text-gray-400 mt-4">
                  {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(review.created_at))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}