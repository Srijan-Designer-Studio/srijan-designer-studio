"use client";

import { useWizard } from "./WizardContext";

export default function Step1BasicInfo() {
  const { formData, updateFormData } = useWizard();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-black">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-[19px] text-gray-500 mt-1">Provide the primary details of your product.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-2">Product Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="e.g. Royal Crimson Banarasi Silk Saree"
            value={formData.title}
            onChange={e => updateFormData({ title: e.target.value })}
            className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-gray-800 mb-2">Product Type <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Saree, Lehenga, Kurti"
              value={formData.productType}
              onChange={e => updateFormData({ productType: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-800 mb-2">Brand</label>
            <input
              type="text"
              placeholder="e.g. Srijan Fashion"
              value={formData.brand}
              onChange={e => updateFormData({ brand: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[13px] font-bold text-gray-800">Short Description <span className="text-red-500">*</span></label>
            <span className="text-[11px] font-bold text-gray-400">{formData.shortDesc.length} / 150</span>
          </div>
          <textarea
            rows="3"
            placeholder="Write a brief, catchy summary of the product..."
            value={formData.shortDesc}
            maxLength={150}
            onChange={e => updateFormData({ shortDesc: e.target.value })}
            className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
          ></textarea>
        </div>
      </div>
    </div>
  );
}