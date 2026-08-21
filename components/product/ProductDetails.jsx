"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Loader2, ShoppingBag } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { addToCart as addToCartServer } from "@/app/actions/shopping";

gsap.registerPlugin(useGSAP);

export default function ProductDetails({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const containerRef = useRef(null);

  const variants = product?.product_variants || [];


  const components = product?.components || product?.product_components || [];

  const images = product?.product_images?.length > 0
    ? product.product_images.map(img => img.image_url)
    : ["/images/placeholder.jpg"];

  const uniqueSizes = [...new Set(
    variants
      .map(v => v.size)
      .filter(Boolean)
      .flatMap(sizeStr => sizeStr.split(',').map(s => s.trim()))
  )];

  const availableSizes = uniqueSizes.length > 0 ? uniqueSizes : ["S", "M", "L", "XL", "XXL"];

  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [size, setSize] = useState(availableSizes[0] || "S");
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setMainImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useGSAP(() => {
    if (!product) return;
    const tl = gsap.timeline();
    tl.fromTo(
      ".prod-img",
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    ).fromTo(
      ".prod-info",
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
      "-=0.6"
    );
  }, { scope: containerRef, dependencies: [product] });

  if (!product) return null;

  const selectedVariant = variants.find(v => v.size && v.size.includes(size)) || variants[0] || {};
  const variantId = selectedVariant.id || product.id;

  const originalPrice = Number(selectedVariant.price) || Number(product.base_price) || 0;
  const salePrice = Number(selectedVariant.sale_price) || Number(selectedVariant.salePrice) || 0;

  const hasDiscount = salePrice > 0 && salePrice < originalPrice;
  const currentPrice = hasDiscount ? salePrice : originalPrice;


  const handleAddToCart = () => {
    startTransition(async () => {
      addToCart({
        id: product.id,
        variantId,
        title: product.title,
        price: currentPrice,
        image: images[mainImageIndex],
        size,
      }, quantity);

      try {
        await addToCartServer(variantId, quantity);
      } catch (error) {
        console.error(error);
      }
    });
  };

  // Buy Now Logic
  const handleBuyNow = () => {
    startTransition(async () => {
      addToCart({
        id: product.id,
        variantId,
        title: product.title,
        price: currentPrice,
        image: images[mainImageIndex],
        size,
      }, quantity);

      try {
        await addToCartServer(variantId, quantity);
        router.push('/checkout');
      } catch (error) {
        router.push('/checkout');
      }
    });
  };

  const tabs = [
    { id: 'description', label: 'Description', content: product.full_description || product.description || '<p>No description available for this product.</p>' }
  ];

  if (product.highlights) {
    tabs.push({ id: 'highlights', label: 'Highlights & Features', content: product.highlights });
  }

  tabs.push({ id: 'material', label: 'Material & Care', content: product.material_care || '<p>Material and care instructions are not available.</p>' });

  tabs.push(
    { id: 'shipping', label: 'Shipping Policy', content: product.shipping_policy || '<p>Standard shipping policies apply.</p>' },
    { id: 'return', label: 'Return/Exchange Policy', content: product.return_policy || '<p>Please refer to our standard return and exchange policy.</p>' }
  );

  return (
    <section className="pt-32 pb-16 bg-white font-sans" ref={containerRef}>
      <div className="max-w-[1200px] w-full mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">

          <div className="prod-img w-full max-w-[500px] mx-auto lg:mx-0 relative">
            <div className="relative w-full aspect-[2/3] rounded-2xl border border-gray-200 overflow-hidden bg-gray-50">
              <img src={images[mainImageIndex]} alt={product.title} className="w-full h-full object-cover object-top" />

              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setMainImageIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${mainImageIndex === idx ? 'w-6 bg-[#00c3ff]' : 'w-4 bg-gray-300 hover:bg-gray-400'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="prod-info mb-4">
              <h1 className="text-[28px] md:text-[34px] font-bold text-black leading-[1.2]">
                {product.title}
              </h1>
            </div>

            <div className="prod-info mb-6 flex items-end gap-3">
              <p className="text-[24px] font-bold text-black leading-none">
                ₹{currentPrice.toLocaleString('en-IN')}
              </p>
              {hasDiscount && (
                <p className="text-[16px] font-medium text-gray-400 line-through leading-none mb-0.5">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <div className="prod-info mb-8">
              <p className="text-[19px] text-gray-700 leading-relaxed">
                {product.short_description || "Experience the perfect blend of style and comfort. Carefully crafted for a premium feel."}
              </p>
            </div>

           
            {components.length > 0 && (
              <div className="prod-info mb-8 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-[13px] font-extrabold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-200 pb-2">This Set Includes:</h3>
                <div className="flex flex-col gap-3">
                  {components.map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-[15px] text-gray-700 flex items-center gap-3 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#00c3ff]"></span>
                        {comp.name} {!comp.required && <span className="text-gray-400 text-[12px]">(Optional)</span>}
                      </span>
                      {comp.price > 0 && (
                        <span className="text-[14px] font-bold text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                          +₹{comp.price}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

           
            {product.additional_info && (
              <div className="prod-info mb-4">
                <div className="inline-block bg-[#fffbeb] border border-[#fde047] text-[#854d0e] text-[12px] px-3.5 py-2.5 rounded-lg font-semibold shadow-sm [&>p]:mb-0">
                  <div dangerouslySetInnerHTML={{ __html: product.additional_info }} />
                </div>
              </div>
            )}

            {/* Size Section */}
            {availableSizes.length > 0 && (
              <div className="prod-info mb-8">
                <h3 className="text-[16px] font-bold text-black mb-3">Size</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`min-w-[48px] px-3 h-12 flex items-center justify-center border text-[16px] transition-colors cursor-pointer rounded ${size === s ? "border-black text-black font-bold" : "border-gray-300 text-gray-600 hover:border-black"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            
            <div className="prod-info flex flex-row items-center gap-3 sm:gap-4 mb-4">
              <div className="flex items-center justify-between border border-black rounded-lg w-[110px] sm:w-[130px] h-[56px] px-3 sm:px-4 shrink-0 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-black hover:opacity-70 cursor-pointer"
                >
                  <Minus size={18} strokeWidth={2} />
                </button>
                <span className="text-[16px] sm:text-[18px] font-bold text-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-black hover:opacity-70 cursor-pointer"
                >
                  <Plus size={18} strokeWidth={2} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isPending}
                className="flex-1 h-[56px] rounded-full flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-[13px] sm:text-[14px] uppercase tracking-wider transition-colors border-[2px] border-[#00c3ff] text-[#00c3ff] hover:bg-[#00c3ff] hover:text-white bg-white cursor-pointer disabled:opacity-70 px-2"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : <ShoppingBag size={18} strokeWidth={2.5} />}
                <span className="whitespace-nowrap">Add to Cart</span>
              </button>
            </div>

            {/* Buy Now Row (Heightened to 56px) */}
            <div className="prod-info">
              <button
                onClick={handleBuyNow}
                disabled={isPending}
                className="w-full h-[56px] bg-[#00c3ff] text-white rounded-full flex items-center justify-center gap-2 font-bold text-[14px] uppercase tracking-wider transition-colors hover:bg-[#00abe0] shadow-md shadow-[#00c3ff]/20 cursor-pointer disabled:opacity-70"
              >
                {isPending ? <Loader2 className="animate-spin" size={18} /> : null}
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t-[3px] border-gray-100 pt-8">
          <div className="flex gap-8 mb-8 overflow-x-auto no-scrollbar pb-1 border-b border-gray-300">
            {tabs.map(tab => (
              <h2
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[16px] md:text-[18px] font-bold pb-3 whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
                    ? 'border-b-[3px] border-black text-black'
                    : 'text-gray-500 hover:text-black border-b-[3px] border-transparent'
                  }`}
              >
                {tab.label}
              </h2>
            ))}
          </div>

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed min-h-[200px]">
            <div dangerouslySetInnerHTML={{ __html: tabs.find(t => t.id === activeTab)?.content }} />
          </div>
        </div>

      </div>
    </section>
  );
}