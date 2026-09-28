"use client";

import { useWizard } from "./WizardContext";
import { Plus, Trash2, Copy } from "lucide-react";

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function Step5Variants() {
  const { formData, updateFormData } = useWizard();

  const addVariant = () => {
    const newVariant = {
      id: generateUUID(),
      size: "",
      color: "",
      barcode: ""
    };
    const currentVariants = formData?.variants || [];
    updateFormData({ variants: [...currentVariants, newVariant] });
  };

  const duplicateVariant = (variant) => {
    const newVariant = {
      ...variant,
      id: generateUUID(),
      barcode: "" 
    };
    const currentVariants = formData?.variants || [];
    updateFormData({ variants: [...currentVariants, newVariant] });
  };

  const removeVariant = (id) => {
    const currentVariants = formData?.variants || [];
    if (currentVariants.length > 1) {
      updateFormData({ variants: currentVariants.filter(v => v.id !== id) });
    } else {
      alert("You must have at least one variant.");
    }
  };

  const updateVariant = (id, field, value) => {
    const currentVariants = formData?.variants || [];
    updateFormData({
      variants: currentVariants.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  const variants = formData?.variants || [];

  return (
    <div className="animate-in fade-in text-black slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Variants & Classifications</h2>
          <p className="text-[19px] text-gray-500 mt-1">Manage sizes, colors, and barcodes for this product.</p>
        </div>
        <button
          onClick={addVariant}
          className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[13px] font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus size={16} /> Add Variant
        </button>
      </div>

      <div className="space-y-6">
        {variants.map((variant, index) => (
          <div key={variant.id} className="bg-gray-50 p-5 rounded-xl border border-gray-200 relative group transition-all hover:border-blue-300 hover:shadow-sm">
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => duplicateVariant(variant)}
                title="Duplicate Variant"
                className="p-1.5 text-gray-400 bg-white border border-gray-200 rounded-md hover:text-blue-600 hover:border-blue-200 transition-colors cursor-pointer"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={() => removeVariant(variant.id)}
                title="Delete Variant"
                className="p-1.5 text-gray-400 bg-white border border-gray-200 rounded-md hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <h3 className="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-5">
              Variant {index + 1}
            </h3>

            {/* 3 Columns Layout (Without Stock & SKU) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Size <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. S, M, L"
                  value={variant.size || ""}
                  onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Color</label>
                <input
                  type="text"
                  placeholder="e.g. Red, Blue"
                  value={variant.color || ""}
                  onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                  className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Barcode</label>
                <input
                  type="text"
                  placeholder="ISBN, UPC"
                  value={variant.barcode || ""}
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