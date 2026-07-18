"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProductActions({ product }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
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

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8" ref={containerRef}>
      <button
        onClick={handleAddToCart}
        disabled={isAdded}
        className={`action-btn-anim flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-[15px] transition-all uppercase tracking-wide border-2 ${isAdded ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border-black text-black hover:bg-black hover:text-white'}`}
      >
        {isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
        {isAdded ? "Added To Cart" : "Add To Cart"}
      </button>

      <button
        onClick={handleBuyNow}
        className="action-btn-anim flex-1 flex items-center justify-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white py-4 rounded-xl font-bold text-[15px] transition-all shadow-lg shadow-[#00c3ff]/30 uppercase tracking-wide"
      >
        <Zap size={20} className="fill-white" />
        Buy It Now
      </button>
    </div>
  );
}