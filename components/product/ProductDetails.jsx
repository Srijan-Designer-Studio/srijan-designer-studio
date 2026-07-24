"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingCart, Zap, Check, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { addToCart as addToCartServer, toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const containerRef = useRef(null);
  
  const availableSizes = [...new Set(product?.product_variants?.map(v => v.size).filter(Boolean))] || ["S", "M", "L"];
  
  const [size, setSize] = useState(availableSizes[0] || "S");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

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

  if (!product) return null;

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);
  const mainImage = product.product_images?.[0]?.image_url || "/images/placeholder.jpg";

  const selectedVariant = product.product_variants?.find(v => v.size === size) || product.product_variants?.[0];
  const variantId = selectedVariant?.id;
  const currentPrice = product.base_price + (selectedVariant?.price_adjustment || 0);

  const handleAddToCart = () => {
    setErrorMsg("");
    startTransition(async () => {
      try {
        await addToCartServer(variantId, quantity);
        addToCart({ 
          id: product.id, 
          variantId, 
          title: product.title, 
          price: currentPrice, 
          image: mainImage, 
          size 
        }, quantity);
        
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } catch (error) {
        setErrorMsg("Please log in to add items to your cart.");
      }
    });
  };

  const handleBuyNow = () => {
    setErrorMsg("");
    startTransition(async () => {
      try {
        await addToCartServer(variantId, quantity);
        addToCart({ id: product.id, variantId, title: product.title, price: currentPrice, image: mainImage, size }, quantity);
        router.push("/checkout");
      } catch (error) {
        setErrorMsg("Please log in to proceed to checkout.");
      }
    });
  };

  const handleWishlist = () => {
    startTransition(async () => {
      try {
        await toggleWishlistServer(product.id);
        toggleWishlist(product);
      } catch (error) {
        setErrorMsg("Please log in to manage your wishlist.");
      }
    });
  };

  return (
    <section className="pt-32 pb-12 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] relative w-full mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          
          <div className="prod-img w-full max-w-[500px] mx-auto lg:mx-0">
            <div className="relative w-full aspect-[3/4] rounded-[24px] border border-gray-200 overflow-hidden mb-6 bg-gray-50">
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover object-top" />
            </div>
          </div>

          <div className="flex flex-col pt-2">
            <h1 className="prod-info text-3xl lg:text-[34px] font-bold text-black leading-[1.2] mb-4">
              {product.title}
            </h1>
            
            <p className="prod-info text-2xl font-bold text-black mb-6">
              ₹{currentPrice.toLocaleString('en-IN')}
            </p>
            
            <p className="prod-info text-[15px] text-[#333] leading-relaxed mb-8">
              {product.description || `Experience the perfect blend of style and comfort with our ${product.title}. Carefully crafted for a premium feel.`}
            </p>

            {availableSizes.length > 0 && (
              <div className="prod-info mb-8">
                <h3 className="text-lg font-bold text-black mb-4">Size</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`w-12 h-12 flex items-center justify-center border rounded-lg text-[16px] transition-colors ${
                        size === s ? "border-black text-black font-bold" : "border-gray-300 text-black hover:border-black"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                onClick={handleWishlist}
                disabled={isPending}
                className={`w-full sm:flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all shadow-sm ${
                  isWishlisted ? 'bg-red-500 text-white hover:bg-red-600 border-transparent' : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                } disabled:opacity-70`}
              >
                <Heart className={isWishlisted ? 'fill-white' : ''} size={18} strokeWidth={2.5} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            <div className="prod-info flex flex-col sm:flex-row gap-4 mt-2">
              <button 
                onClick={handleAddToCart}
                disabled={isAdded || isPending}
                className={`flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all shadow-sm ${
                  isAdded ? 'bg-green-500 text-white cursor-default border-transparent' : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'
                } disabled:opacity-70`}
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : isAdded ? <Check size={18} strokeWidth={2.5} /> : <ShoppingCart size={18} strokeWidth={2.5} />}
                {isAdded ? "Added To Cart" : "Add To Cart"}
              </button>

              <button 
                onClick={handleBuyNow}
                disabled={isPending}
                className="flex-1 h-[52px] bg-[#00c3ff] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide hover:bg-[#00abe0] transition-colors shadow-md shadow-[#00c3ff]/30 disabled:opacity-70"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : <Zap className="fill-white" size={18} strokeWidth={2.5} />}
                Buy It Now
              </button>
            </div>

            {errorMsg && <p className="text-red-500 text-sm mt-4 font-medium">{errorMsg}</p>}
            
          </div>
        </div>
      </div>
    </section>
  );
}