"use client";

import { useWizard } from "./WizardContext";
import { CheckCircle2, XCircle, UploadCloud, Clock, Save, Loader2 } from "lucide-react";

export default function Step10Publish() {
  const { formData, goToStep, publishProduct, isSubmitting } = useWizard();

  const checks = [
    {
      id: 1,
      title: "Basic Information",
      isValid: !!formData.title && !!formData.productType && !!formData.shortDesc,
      errorMsg: "Title, Product Type, and Short Description are required."
    },
    {
      id: 2,
      title: "Product Details",
      isValid: !!formData.description,
      errorMsg: "Main description is required."
    },
    {
      id: 4,
      title: "Media & Images",
      isValid: formData.images.length > 0,
      errorMsg: "At least one product image is required."
    },
    {
      id: 5,
      title: "Variants & Inventory",
      isValid: formData.variants.length > 0 && formData.variants.every(v => v.size && v.stock !== ""),
      errorMsg: "All variants must have a Size and Stock quantity."
    },
    {
      id: 6,
      title: "Pricing & Bundle",
      isValid: !!formData.basePrice && Number(formData.basePrice) > 0,
      errorMsg: "A valid Base Price is required."
    }
  ];

  const isFormValid = checks.every(c => c.isValid);

  return (
    <div className="animate-in fade-in text-black slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Review & Publish</h2>
        <p className="text-[19px] text-gray-500 mt-1">Review your product details before making it live on the store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-wider mb-2">Pre-Publish Checklist</h3>

          {checks.map((check) => (
            <div
              key={check.id}
              onClick={() => !check.isValid ? goToStep(check.id) : null}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${check.isValid ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100 cursor-pointer hover:bg-red-50'}`}
            >
              {check.isValid ? (
                <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              )}

              <div>
                <h4 className={`text-[14px] font-bold ${check.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {check.title}
                </h4>
                {!check.isValid && (
                  <p className="text-[12px] text-red-600 mt-1">{check.errorMsg} Click to fix.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-between">
          <div>
            <h3 className="text-[13px] font-extrabold text-gray-800 uppercase tracking-wider mb-6">Actions</h3>

            <button disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:border-gray-300 hover:bg-gray-50 transition-all mb-4 disabled:opacity-50">
              <Save size={18} /> Save as Draft
            </button>

            <button disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl text-[14px] font-bold hover:border-gray-300 hover:bg-gray-50 transition-all mb-8 disabled:opacity-50">
              <Clock size={18} /> Schedule Publish
            </button>
          </div>

          <button
            disabled={!isFormValid || isSubmitting}
            onClick={publishProduct}
            className={`w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl text-[15px] font-bold transition-all shadow-lg ${isFormValid && !isSubmitting ? 'bg-[#00c3ff] text-white hover:bg-[#00abe0] hover:shadow-[#00c3ff]/30' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
          >
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
            {isSubmitting ? "Publishing..." : "Publish Product"}
          </button>
        </div>
      </div>
    </div>
  );
}