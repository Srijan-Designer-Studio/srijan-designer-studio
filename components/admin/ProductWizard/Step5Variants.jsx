"use client";

import { useWizard } from "./WizardContext";
import { Plus, Trash2, Copy } from "lucide-react";

export default function Step5Variants() {
  const { formData, updateFormData } = useWizard();

  const addVariant = () => {
    const newVariant = {
      id: Date.now(), size: "", color: "", price: "", salePrice: "", sku: "", stock: "0", lowStock: "5", barcode: ""
    };
    updateFormData({ variants: [...formData.variants, newVariant] });
  };

  const duplicateVariant = (variant) => {
    const newVariant = { 
      ...variant, 
      id: Date.now(), 
      sku: variant.sku ? `${variant.sku}-COPY` : "" 
    };
    updateFormData({ variants: [...formData.variants, newVariant] });
  };

  const removeVariant = (id) => {
    if (formData.variants.length > 1) {
      updateFormData({ variants: formData.variants.filter(v => v.id !== id) });
    } else {
      alert("You must have at least one variant.");
    }
  };

  const updateVariant = (id, field, value) => {
    updateFormData({
      variants: formData.variants.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  return (
    <div className="animate-in fade-in text-black slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Variants & Inventory</h2>
          <p className="text-[13px] text-gray-500 mt-1">Manage sizes, colors, pricing, and stock for this product.</p>
        </div>
        <button 
          onClick={addVariant}
          className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[13px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Add Variant
        </button>
      </div>

      <div className="space-y-6">
        {formData.variants.map((variant, index) => (
          <div key={variant.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group transition-all hover:border-blue-300 hover:shadow-sm">
            
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => duplicateVariant(variant)}
                title="Duplicate Variant"
                className="p-1.5 text-gray-400 bg-white border border-gray-200 rounded-md hover:text-blue-600 hover:border-blue-200 transition-colors"
              >
                <Copy size={14} />
              </button>
              <button 
                onClick={() => removeVariant(variant.id)}
                title="Delete Variant"
                className="p-1.5 text-gray-400 bg-white border border-gray-200 rounded-md hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-5">
              Variant {index + 1}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Size <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Free Size, XL"
                  value={variant.size} 
                  onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>
              
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Color</label>
                <input 
                  type="text" 
                  placeholder="e.g. Crimson Red"
                  value={variant.color} 
                  onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={variant.price} 
                  onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Sale Price (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={variant.salePrice} 
                  onChange={(e) => updateVariant(variant.id, 'salePrice', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">SKU</label>
                <input 
                  type="text" 
                  placeholder="e.g. SRI-CRIM-S"
                  value={variant.sku} 
                  onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Stock Quantity <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={variant.stock} 
                  onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Low Stock Alert</label>
                <input 
                  type="number" 
                  placeholder="5"
                  value={variant.lowStock} 
                  onChange={(e) => updateVariant(variant.id, 'lowStock', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Barcode (Optional)</label>
                <input 
                  type="text" 
                  placeholder="ISBN, UPC, GTIN"
                  value={variant.barcode} 
                  onChange={(e) => updateVariant(variant.id, 'barcode', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}