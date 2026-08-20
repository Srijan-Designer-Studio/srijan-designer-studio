"use client";

import { useWizard } from "./WizardContext";

export default function Step7Shipping() {
  const { formData, updateFormData } = useWizard();

  return (
    <div className="animate-in text-black fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
        <p className="text-[19px] text-gray-500 mt-1">Configure package dimensions, weight, and delivery options.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[13px] font-bold text-gray-800 mb-2">Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.weight}
              onChange={(e) => updateFormData({ weight: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-gray-800 mb-2">Estimated Delivery</label>
            <input
              type="text"
              placeholder="e.g. 3-5 Business Days"
              value={formData.estimatedDelivery}
              onChange={(e) => updateFormData({ estimatedDelivery: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
          <label className="block text-[13px] font-bold text-gray-800 mb-4">Package Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Length</label>
              <input
                type="number"
                placeholder="0"
                value={formData.length}
                onChange={(e) => updateFormData({ length: e.target.value })}
                className="w-full text-[13px] border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Width</label>
              <input
                type="number"
                placeholder="0"
                value={formData.width}
                onChange={(e) => updateFormData({ width: e.target.value })}
                className="w-full text-[13px] border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1">Height</label>
              <input
                type="number"
                placeholder="0"
                value={formData.height}
                onChange={(e) => updateFormData({ height: e.target.value })}
                className="w-full text-[13px] border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-3">Shipping Class</label>
          <select
            value={formData.shippingClass}
            onChange={(e) => updateFormData({ shippingClass: e.target.value })}
            className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
          >
            <option value="Standard">Standard</option>
            <option value="Express">Express</option>
            <option value="Heavy">Heavy/Bulky</option>
            <option value="Fragile">Fragile</option>
          </select>
        </div>

        <div className="flex flex-col gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isCodAvailable}
              onChange={(e) => updateFormData({ isCodAvailable: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-[19px] font-bold text-gray-800">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-gray-500">Allow customers to pay upon delivery.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isFreeShipping}
              onChange={(e) => updateFormData({ isFreeShipping: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-[19px] font-bold text-gray-800">Free Shipping</p>
              <p className="text-[11px] text-gray-500">Do not charge shipping fees for this product.</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isReturnEligible}
              onChange={(e) => updateFormData({ isReturnEligible: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <div>
              <p className="text-[19px] font-bold text-gray-800">Return Eligible</p>
              <p className="text-[11px] text-gray-500">Allow customers to return this product.</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}