"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Check, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { addToCart as addToCartServer } from "@/app/actions/shopping";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductActions({ product }) {
  const { addToCart: addToCartLocal } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ".action-btn-anim",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, { scope: containerRef });

  // Extract variant ID based on the new database schema (fallback to product.id if variants aren't loaded yet)
  const variantId = product?.product_variants?.[0]?.id || product?.id;

  const handleAddToCart = () => {
    setErrorMsg("");
    startTransition(async () => {
      try {
        // 1. Persist to Supabase Database via Server Action
        await addToCartServer(variantId, 1);

        // 2. Update local Context for immediate UI response
        addToCartLocal(product, 1);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        setErrorMsg(error.message || "Failed to add to cart. Please log in.");
      }
    });
  };

  const handleBuyNow = () => {
    setErrorMsg("");
    startTransition(async () => {
      try {
        // Persist to database before redirecting
        await addToCartServer(variantId, 1);
        addToCartLocal(product, 1);
        router.push("/checkout");
      } catch (error) {
        setErrorMsg(error.message || "Failed to initiate checkout. Please log in.");
      }
    });
  };

  return (
    <div className="flex flex-col mt-8" ref={containerRef}>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdded || isPending}
          className={`action-btn-anim flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] transition-all uppercase tracking-wide border-2 ${isAdded
              ? 'bg-green-50 border-green-500 text-green-600'
              : 'bg-white border-black text-black hover:bg-black hover:text-white'
            } disabled:opacity-70`}
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : isAdded ? (
            <Check size={20} />
          ) : (
            <ShoppingCart size={20} />
          )}
          {isPending ? "Adding..." : isAdded ? "Added To Cart" : "Add To Cart"}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={isPending}
          className="action-btn-anim flex-1 flex items-center justify-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white py-4 rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide disabled:opacity-70"
        >
          {isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Zap size={20} className="fill-white" />
          )}
          Buy It Now
        </button>
      </div>

      {/* Error Message Display */}
      {errorMsg && (
        <p className="text-[19px] text-red-500 mt-3 font-medium text-center">
          {errorMsg}
        </p>
      )}
    </div>
  );
}