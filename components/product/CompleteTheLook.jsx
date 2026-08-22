"use client";

import { useState, useTransition } from "react";
import { Check, Plus, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { addToCart as addToCartServer } from "@/app/actions/shopping";

export default function CompleteTheLook({ addons = [], mainProduct, mainProductVariantId, mainProductSize, mainImage, mainQuantity }) {
  const { addToCart } = useCart();
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [isPending, startTransition] = useTransition();
  const [addedSuccess, setAddedSuccess] = useState(false);

  const [localSizes, setLocalSizes] = useState({});

  const addonTypes = [...new Set(addons.map(a => a.component_type || 'Top'))];

  if (activeTab === "" && addonTypes.length > 0) {
    setActiveTab(addonTypes[0]);
  }

  if (addons.length === 0) return null;

  const currentTabAddons = addons.filter(a => (a.component_type || 'Top') === activeTab);

  const mainPrice = Number(mainProduct.sale_price) || Number(mainProduct.base_price) || 0;
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const finalTotal = (mainPrice * mainQuantity) + addonsTotal;

  const handleToggleAddon = (addonItem, selectedSize) => {
    const existing = selectedAddons.find(item => item.addonId === addonItem.id);
    if (existing) {
      setSelectedAddons(selectedAddons.filter(item => item.addonId !== addonItem.id));
    } else {
      setSelectedAddons([
        ...selectedAddons,
        {
          addonId: addonItem.id,
          productId: mainProduct.id, 
          variantId: `comp-${addonItem.id}`, 
          title: addonItem.name,
          image: addonItem.image_url || "/images/placeholder.jpg",
          size: selectedSize || "Free Size",
          price: Number(addonItem.price) || 0
        }
      ]);
    }
  };

  const handleAddAllToCart = () => {
    startTransition(async () => {
      // 1. Add Main Product
      addToCart({
        id: mainProduct.id,
        variantId: mainProductVariantId,
        title: mainProduct.title,
        price: mainPrice,
        image: mainImage,
        size: mainProductSize,
      }, mainQuantity);
      
      try { await addToCartServer(mainProductVariantId, mainQuantity); } catch (err) {}

      // 2. Add All Selected Add-ons
      for (const item of selectedAddons) {
        addToCart(item, 1);
        try { await addToCartServer(item.variantId, 1); } catch (err) {}
      }

      setAddedSuccess(true);
      setSelectedAddons([]);
      setTimeout(() => setAddedSuccess(false), 3000);
    });
  };

  return (
    <div className="mt-8 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm text-black">
      <h3 className="text-[16px] font-bold text-gray-900 mb-1 flex items-center gap-1.5">
        Complete the Look <span className="text-yellow-500">✨</span>
      </h3>
      <p className="text-[12px] text-gray-500 mb-5">Pair this product with these complementary pieces</p>

      {addonTypes.length > 1 && (
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          {addonTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-1.5 rounded-md text-[12px] font-bold transition-all whitespace-nowrap ${activeTab === type ? 'bg-[#5a4bda] text-white shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              Add {type}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
        {currentTabAddons.map(addon => {
          const isSelected = selectedAddons.some(item => item.addonId === addon.id);
          const defaultSizes = ["S", "M", "L", "XL", "XXL"];          
          
          const currentSize = localSizes[addon.id] || "S";

          return (
            <div key={addon.id} className="w-[140px] bg-white border border-gray-200 rounded-xl p-2.5 snap-start shrink-0 flex flex-col transition-all hover:border-gray-300">
              {/* Product Image - Contain to avoid cropping */}
              <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-50 mb-2.5 flex items-center justify-center">
                <img src={addon.image_url || "/images/placeholder.jpg"} alt={addon.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
              </div>
              
              <h4 className="text-[12px] font-semibold text-gray-800 line-clamp-2 mb-1 leading-snug flex-1">{addon.name}</h4>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[13px] font-extrabold text-black">₹{Number(addon.price).toLocaleString('en-IN')}</span>
              </div>

              {!isSelected && (
                <div className="mb-2.5">
                  <select 
                    value={currentSize} 
                    onChange={(e) => setLocalSizes(prev => ({ ...prev, [addon.id]: e.target.value }))}
                    className="w-full text-[11px] border border-gray-200 rounded px-1.5 py-1.5 outline-none focus:border-[#00c3ff] cursor-pointer bg-white"
                  >
                    {defaultSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <button
                onClick={() => handleToggleAddon(addon, currentSize)}
                className={`w-full py-1.5 rounded-md text-[12px] font-bold flex items-center justify-center gap-1 transition-all mt-auto cursor-pointer ${isSelected ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-white border border-[#00c3ff] text-[#00c3ff] hover:bg-[#00c3ff] hover:text-white'}`}
              >
                {isSelected ? <><Check size={14} /> Added</> : 'ADD'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Cart Summary Panel */}
      {selectedAddons.length > 0 && (
        <div className="mt-4 p-4 bg-[#f4fbfc] border border-[#00c3ff]/30 rounded-xl">
          <h4 className="text-[13px] font-bold text-gray-900 mb-2 border-b border-[#00c3ff]/10 pb-2">Bundle Summary</h4>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[12px] text-gray-600 line-clamp-1 pr-3">{mainQuantity}x {mainProduct.title}</span>
            <span className="text-[12px] font-bold text-gray-900 whitespace-nowrap">₹{(mainPrice * mainQuantity).toLocaleString('en-IN')}</span>
          </div>
          {selectedAddons.map(item => (
            <div key={item.addonId} className="flex justify-between items-center mb-1.5">
              <span className="text-[12px] text-gray-600 line-clamp-1 pr-3">+ {item.title} ({item.size})</span>
              <span className="text-[12px] font-bold text-gray-900 whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#00c3ff]/20">
            <span className="text-[14px] font-bold text-black">Total Amount</span>
            <span className="text-[16px] font-extrabold text-[#00c3ff]">₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
          <button
            onClick={handleAddAllToCart}
            disabled={isPending || addedSuccess}
            className="w-full mt-4 py-2.5 bg-[#00c3ff] hover:bg-[#00abe0] text-white rounded-lg text-[13px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-70"
          >
            {isPending ? <Loader2 className="animate-spin" size={16} /> : addedSuccess ? <Check size={16} /> : <ShoppingBag size={16} />}
            {isPending ? "Adding..." : addedSuccess ? "Added to Cart!" : "Add Selected Items to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}