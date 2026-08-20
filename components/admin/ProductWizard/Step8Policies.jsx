"use client";

import { useWizard } from "./WizardContext";
import RichTextEditor from "./RichTextEditor";
import { Plus, Trash2 } from "lucide-react";

export default function Step8Policies() {
  const { formData, updateFormData } = useWizard();

  const addFaq = () => {
    const newFaq = { id: Date.now(), question: "", answer: "" };
    updateFormData({ faqs: [...formData.faqs, newFaq] });
  };

  const removeFaq = (id) => {
    updateFormData({ faqs: formData.faqs.filter(f => f.id !== id) });
  };

  const updateFaq = (id, field, value) => {
    updateFormData({
      faqs: formData.faqs.map(f => f.id === id ? { ...f, [field]: value } : f)
    });
  };

  return (
    <div className="animate-in text-black fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Policies & FAQ</h2>
        <p className="text-[19px] text-gray-500 mt-1">Set product-specific policies and answer common customer questions.</p>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-[15px] font-extrabold text-gray-800 mb-6 border-b border-gray-100 pb-3">Policies</h3>

          <RichTextEditor
            label="Shipping Policy"
            placeholder="Enter shipping timelines, rules, and restrictions..."
            value={formData.shippingPolicy}
            onChange={(val) => updateFormData({ shippingPolicy: val })}
          />

          <RichTextEditor
            label="Return & Exchange Policy"
            placeholder="Enter return window, conditions, and process..."
            value={formData.returnPolicy}
            onChange={(val) => updateFormData({ returnPolicy: val })}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
            <h3 className="text-[15px] font-extrabold text-gray-800">Frequently Asked Questions</h3>
            <button
              onClick={addFaq}
              className="text-[12px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          {formData.faqs.length > 0 ? (
            <div className="space-y-4">
              {formData.faqs.map((faq, idx) => (
                <div key={faq.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                  <button
                    onClick={() => removeFaq(faq.id)}
                    className="absolute top-4 right-4 p-1.5 text-gray-400 bg-white border border-gray-200 rounded-md hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>

                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Question {idx + 1}</h4>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="e.g. Does this saree come with a stitched blouse?"
                      value={faq.question}
                      onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                      className="w-full text-[13px] font-bold border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white pr-10"
                    />
                    <textarea
                      rows="2"
                      placeholder="Provide a clear and helpful answer..."
                      value={faq.answer}
                      onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
                      className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500 bg-white resize-none"
                    ></textarea>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[19px] text-gray-500 font-medium">No FAQs added yet.</p>
              <button
                onClick={addFaq}
                className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 font-bold text-[12px] rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
              >
                Create First FAQ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}