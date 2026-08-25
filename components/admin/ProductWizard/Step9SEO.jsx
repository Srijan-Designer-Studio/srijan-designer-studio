"use client";

import { useWizard } from "./WizardContext";
import { Wand2 } from "lucide-react";

export default function Step9SEO() {
  const { formData, updateFormData } = useWizard();

  const generateSEO = () => {
    const generatedSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    updateFormData({
      seoTitle: `${formData.title} | Srijan Fashion`,
      seoSlug: generatedSlug,
      metaDesc: formData.shortDesc.slice(0, 160),
      focusKeyword: formData.productType.toLowerCase(),
      seoKeywords: `${formData.productType}, ${formData.department}, ${formData.brand}`.toLowerCase()
    });
  };

  const handleSchemaFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      updateFormData({ schemaMarkup: event.target.result });
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-in fade-in text-black slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Search Engine Optimization</h2>
          <p className="text-[19px] text-gray-500 mt-1">Optimize how this product appears on Google and other search engines.</p>
        </div>
        <button
          onClick={generateSEO}
          className="px-4 py-2 bg-[#00c3ff]/10 text-[#00c3ff] border border-[#00c3ff]/20 rounded-lg text-[13px] font-bold hover:bg-[#00c3ff]/20 transition-colors flex items-center gap-2 shrink-0"
        >
          <Wand2 size={16} /> Auto Generate SEO
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-[13px] font-extrabold text-gray-800 mb-4">Google Search Preview</h3>
          <div className="max-w-[600px] bg-white p-4 rounded-lg border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold">S</div>
              <div>
                <p className="text-[12px] text-gray-800">Srijan Fashion</p>
                <p className="text-[11px] text-gray-500">https://srijanfashion.com/product/{formData.seoSlug || "product-slug"}</p>
              </div>
            </div>
            <h4 className="text-[18px] text-[#1a0dab] hover:underline cursor-pointer truncate">
              {formData.seoTitle || formData.title || "Product SEO Title"}
            </h4>
            <p className="text-[19px] text-[#4d5156] mt-1 line-clamp-2">
              {formData.metaDesc || formData.shortDesc || "Provide a meta description to see how it will appear in search results."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[13px] font-bold text-gray-800">SEO Product Name (Meta Title)</label>
              <span className={`text-[11px] font-bold ${formData.seoTitle.length > 60 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.seoTitle.length} / 60
              </span>
            </div>
            <input
              type="text"
              value={formData.seoTitle}
              onChange={(e) => updateFormData({ seoTitle: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[13px] font-bold text-gray-800">Meta Description</label>
              <span className={`text-[11px] font-bold ${formData.metaDesc.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.metaDesc.length} / 160
              </span>
            </div>
            <textarea
              rows="3"
              value={formData.metaDesc}
              onChange={(e) => updateFormData({ metaDesc: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-800 mb-2">URL Slug</label>
            <input
              type="text"
              value={formData.seoSlug}
              onChange={(e) => updateFormData({ seoSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] font-bold text-gray-800 mb-2">Focus Keyword</label>
              <input
                type="text"
                value={formData.focusKeyword}
                onChange={(e) => updateFormData({ focusKeyword: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-800 mb-2">SEO Keywords (Comma separated)</label>
              <input
                type="text"
                value={formData.seoKeywords}
                onChange={(e) => updateFormData({ seoKeywords: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-800 mb-2">Canonical URL (Optional)</label>
            <input
              type="text"
              placeholder="https://"
              value={formData.canonicalUrl}
              onChange={(e) => updateFormData({ canonicalUrl: e.target.value })}
              className="w-full text-sm border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 bg-white"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-bold text-gray-800">Schema Markup (JSON-LD)</label>
              <label className="text-[11px] font-bold bg-white hover:bg-gray-100 text-blue-600 px-3 py-1.5 rounded-md cursor-pointer transition-colors border border-gray-200 shadow-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                Upload .json file
                <input type="file" accept=".json,.txt" className="hidden" onChange={handleSchemaFileUpload} />
              </label>
            </div>
            <textarea
              placeholder="Paste your schema script here or upload a file..."
              rows="5"
              value={formData.schemaMarkup || ""}
              onChange={(e) => updateFormData({ schemaMarkup: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 bg-gray-900 text-green-400 font-mono text-[13px]"
            />
          </div>

        </div>
      </div>
    </div>
  );
}