"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingCart, Zap, Check } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { allProducts } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetails({ id }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const containerRef = useRef(null);
  
  const [size, setSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = allProducts.find((item) => item.id.toString() === id?.toString());

  useGSAP(() => {
    if (!product) return;
    const tl = gsap.timeline();
    tl.fromTo(
      ".prod-img",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      ".prod-info",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      "-=0.7"
    );
  }, { scope: containerRef, dependencies: [product] });

  if (!product) {
    return (
      <div className="py-32 text-center flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found!</h2>
        <p className="text-gray-500">The product you are looking for does not exist.</p>
      </div>
    );
  }

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize: size }, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({ ...product, selectedSize: size }, quantity);
    router.push("/checkout");
  };

  return (
    <section className="py-12 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          
          <div className="prod-img w-full max-w-[500px] mx-auto lg:mx-0">
            <div className="relative w-full aspect-[3/4] rounded-[24px] border border-gray-200 overflow-hidden mb-6 bg-gray-50">
              {product.image && (
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  className="object-cover object-top"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col pt-2">
            
            <h1 className="prod-info text-3xl lg:text-[34px] font-bold text-black leading-[1.2] mb-4">
              {product.title}
            </h1>
            
            <p className="prod-info text-2xl font-bold text-black mb-6">
              ₹{product.price?.toLocaleString('en-IN') || product.price}
            </p>
            
            <p className="prod-info text-[15px] text-[#333] leading-relaxed mb-8">
              Experience the perfect blend of style and comfort with our {product.title}. Carefully crafted for a premium feel.
            </p>

            <div className="prod-info mb-8">
              <h3 className="text-lg font-bold text-black mb-4">Size</h3>
              <div className="flex flex-wrap items-center gap-3">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-12 h-12 flex items-center justify-center border rounded-lg text-[16px] transition-colors ${
                      size === s
                        ? "border-black text-black font-bold"
                        : "border-gray-300 text-black hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="prod-info flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center justify-between border border-gray-300 rounded-lg w-full sm:w-[140px] h-[52px] px-4 shrink-0 bg-gray-50">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-600 hover:text-black">
                  <Minus size={20} strokeWidth={2} />
                </button>
                <span className="text-[17px] font-medium text-black">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-600 hover:text-black">
                  <Plus size={20} strokeWidth={2} />
                </button>
              </div>
              
              <button 
                onClick={() => toggleWishlist(product)}
                className={`w-full sm:flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all shadow-sm ${
                  isWishlisted 
                    ? 'bg-red-500 text-white hover:bg-red-600 border-transparent' 
                    : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                }`}
              >
                <Heart size={18} strokeWidth={2.5} className={isWishlisted ? 'fill-white' : ''} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            <div className="prod-info flex flex-col sm:flex-row gap-4 mt-2">
              <button 
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all shadow-sm ${
                  isAdded 
                    ? 'bg-green-500 text-white cursor-default border-transparent' 
                    : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                }`}
              >
                {isAdded ? <Check size={18} strokeWidth={2.5} /> : <ShoppingCart size={18} strokeWidth={2.5} />}
                {isAdded ? "Added To Cart" : "Add To Cart"}
              </button>

              <button 
                onClick={handleBuyNow}
                className="flex-1 h-[52px] bg-[#00c3ff] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide hover:bg-[#00abe0] transition-colors shadow-md shadow-[#00c3ff]/30"
              >
                <Zap size={18} strokeWidth={2.5} className="fill-white" />
                Buy It Now
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}