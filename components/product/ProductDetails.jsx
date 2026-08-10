"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus, ShoppingCart, Zap, Check, Loader2, CreditCard, Smartphone, Wallet, Building2, Ban, ShieldCheck, Tag } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { addToCart as addToCartServer, toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

gsap.registerPlugin(useGSAP);

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlistItems } = useCart();
  const containerRef = useRef(null);

  const variants = product?.product_variants || [];
  
  // Image Gallery Handling
  const images = product?.product_images?.length > 0
    ? product.product_images.map(img => img.image_url)
    : ["/images/placeholder.jpg"];

  // Unique Sizes & Colors from Variants
  const uniqueSizes = [...new Set(
    variants
      .map(v => v.size)
      .filter(Boolean)
      .flatMap(sizeStr => sizeStr.split(',').map(s => s.trim()))
  )];

  const uniqueColors = [...new Set(
    variants
      .map(v => v.color)
      .filter(Boolean)
      .flatMap(colorStr => colorStr.split(',').map(c => c.trim()))
  )];

  const availableSizes = uniqueSizes.length > 0 ? uniqueSizes : ["S", "M", "L", "XL"];

  const [mainImage, setMainImage] = useState(images[0]);
  const [size, setSize] = useState(availableSizes[0] || "S");
  const [color, setColor] = useState(uniqueColors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  const selectedVariant = variants.find(v =>
    (!size || (v.size && v.size.includes(size))) &&
    (!color || (v.color && v.color.includes(color)))
  ) || variants[0];

  const variantId = selectedVariant?.id || product.id;

  // Pricing Logic (Supports Regular & Sale Price from updated Admin Panel)
  const basePrice = product.base_price || 0;
  const variantPrice = selectedVariant?.price || basePrice;
  const variantSalePrice = selectedVariant?.sale_price || (basePrice + (selectedVariant?.price_adjustment || 0));

  const hasDiscount = variantPrice > variantSalePrice;
  const currentPrice = hasDiscount ? variantSalePrice : variantPrice;

  const handleAddToCart = () => {
    startTransition(async () => {
      addToCart({
        id: product.id,
        variantId,
        title: product.title,
        price: currentPrice,
        image: mainImage,
        size,
        color
      }, quantity);

      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);

      try {
        await addToCartServer(variantId, quantity);
      } catch (error) {}
    });
  };

  const handleBuyNow = () => {
    startTransition(async () => {
      addToCart({
        id: product.id,
        variantId,
        title: product.title,
        price: currentPrice,
        image: mainImage,
        size,
        color
      }, quantity);

      router.push("/checkout");

      try {
        await addToCartServer(variantId, quantity);
      } catch (error) {}
    });
  };

  const handleWishlist = () => {
    startTransition(async () => {
      toggleWishlist(product);

      try {
        await toggleWishlistServer(product.id);
      } catch (error) {}
    });
  };

  return (
    <section className="pt-32 pb-12 bg-white" ref={containerRef}>
      <div className="max-w-[1320px] relative w-full mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

          {/* Left: Image Gallery */}
          <div className="prod-img w-full max-w-[600px] mx-auto lg:mx-0 flex flex-col-reverse md:flex-row gap-4">
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar pb-2 md:pb-0 md:pr-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-24 shrink-0 rounded-xl border-2 overflow-hidden transition-all ${mainImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={img} alt={`${product.title} - ${idx + 1}`} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative flex-1 aspect-[3/4] rounded-[24px] border border-gray-200 overflow-hidden mb-6 md:mb-0 bg-gray-50">
              <img src={mainImage} alt={product.title} className="w-full h-full object-cover object-top" />
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md uppercase tracking-wider">
                  <Tag size={12} /> Sale
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col pt-2">
            
            <div className="prod-info mb-4">
              {product.brand && (
                <span className="text-sm font-bold text-[#5a4bda] uppercase tracking-wider mb-2 block">
                  {product.brand}
                </span>
              )}
              <h1 className="text-3xl lg:text-[34px] font-bold text-black leading-[1.2]">
                {product.title}
              </h1>
            </div>

            <div className="prod-info mb-6 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-black">
                  ₹{currentPrice.toLocaleString('en-IN')}
                </p>
                {hasDiscount && (
                  <p className="text-lg font-medium text-gray-400 line-through">
                    ₹{variantPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
              {hasDiscount && (
                <p className="text-[13px] font-bold text-green-600 mt-1.5 bg-green-50 inline-block px-2.5 py-1 rounded-md">
                  You save ₹{(variantPrice - currentPrice).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div className="prod-info mb-8">
              <p className="text-[15px] text-[#333] leading-relaxed">
                {product.short_description || product.description || `Experience the perfect blend of style and comfort with our ${product.title}. Carefully crafted for a premium feel.`}
              </p>
            </div>

            {/* Colors */}
            {uniqueColors.length > 0 && (
              <div className="prod-info mb-6">
                <h3 className="text-[13px] font-bold text-gray-900 mb-3 uppercase tracking-wide">Color</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {uniqueColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      title={c}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${color === c ? "border-black scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                      style={{ backgroundColor: c.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div className="prod-info mb-8">
                <div className="flex items-center justify-between mb-3">
                   <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wide">Size</h3>
                   <button className="text-[12px] font-bold text-gray-500 hover:text-black underline">Size Guide</button>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      aria-label={`Select size ${s}`}
                      className={`min-w-[48px] px-3 h-12 flex items-center justify-center border rounded-lg text-[15px] transition-colors cursor-pointer ${size === s ? "bg-black border-black text-white font-bold" : "bg-white border-gray-300 text-black hover:border-black"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart & Actions */}
            <div className="prod-info flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="flex items-center justify-between border border-gray-300 rounded-lg w-full sm:w-[140px] h-[52px] px-4 shrink-0 bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="text-gray-600 hover:text-black cursor-pointer"
                >
                  <Minus size={20} strokeWidth={2} />
                </button>
                <span className="text-[17px] font-medium text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="text-gray-600 hover:text-black cursor-pointer"
                >
                  <Plus size={20} strokeWidth={2} />
                </button>
              </div>

              <button
                onClick={handleWishlist}
                disabled={isPending}
                aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                className={`w-full sm:flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all shadow-sm cursor-pointer ${isWishlisted ? 'bg-red-500 text-white hover:bg-red-600 border-transparent' : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <Heart className={isWishlisted ? 'fill-white' : ''} size={18} strokeWidth={2.5} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </button>
            </div>

            <div className="prod-info flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={handleAddToCart}
                disabled={isAdded || isPending}
                aria-label="Add to Cart"
                className={`flex-1 h-[52px] rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide transition-all shadow-sm cursor-pointer ${isAdded ? 'bg-green-500 text-white cursor-default border-transparent' : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white'} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : isAdded ? <Check size={18} strokeWidth={2.5} /> : <ShoppingCart size={18} strokeWidth={2.5} />}
                {isAdded ? "Added To Cart" : "Add To Cart"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isPending}
                aria-label="Buy it Now"
                className="flex-1 h-[52px] bg-[#00c3ff] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wide hover:bg-[#00abe0] transition-colors shadow-md shadow-[#00c3ff]/30 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : <Zap className="fill-white" size={18} strokeWidth={2.5} />}
                Buy It Now
              </button>
            </div>

            {/* Payment & Security info */}
            <div className="prod-info mt-8 border border-gray-200/60 bg-gray-50/50 p-5 rounded-2xl">
              <h3 className="text-[13px] font-extrabold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" />
                Payment Gateway Support
              </h3>
              
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                  <Smartphone size={15} className="text-[#00baf2]" /> Paytm
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                  <Smartphone size={15} className="text-[#6528e0]" /> UPI
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                  <CreditCard size={15} className="text-gray-900" /> Cards
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                  <Building2 size={15} className="text-orange-500" /> Net Banking
                </div>
                <div className="flex items-center gap-1.5 text-[12px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl shadow-sm">
                  <Wallet size={15} className="text-pink-500" /> Wallet
                </div>
              </div>

              <div className="inline-flex items-center gap-2 text-[12px] font-bold text-red-600 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
                <Ban size={14} strokeWidth={3} />
                No Cash on Delivery (COD) Available
              </div>
            </div>
          </div>
        </div>
        
        {/* Full Description Section */}
        {product.full_description && (
          <div className="mt-10 pt-10 border-t border-gray-200">
             <h2 className="text-xl font-bold text-black mb-6">Product Information</h2>
             <div 
               className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
               dangerouslySetInnerHTML={{ __html: product.full_description }} 
             />
          </div>
        )}
      </div>
    </section>
  );
}