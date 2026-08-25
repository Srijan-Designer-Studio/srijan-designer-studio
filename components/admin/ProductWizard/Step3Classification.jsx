"use client";

import { useState } from "react";
import { useWizard } from "./WizardContext";
import { X, Plus } from "lucide-react";

const AVAILABLE_COLLECTIONS = ["New Arrivals", "Western Wear", "Ethnic Wear", "Wedding Wear"];

export default function Step3Classification() {
  const { formData, updateFormData } = useWizard();
  const [tagInput, setTagInput] = useState("");

  const toggleArrayItem = (field, item) => {
    const currentArray = formData[field] || [];
    if (currentArray.includes(item)) {
      updateFormData({ [field]: currentArray.filter(i => i !== item) });
    } else {
      updateFormData({ [field]: [...currentArray, item] });
    }
  };

  const handleAddCustomCollection = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const newCollection = tagInput.trim();
      const currentCollections = formData.collections || [];
      if (newCollection && !currentCollections.includes(newCollection)) {
        updateFormData({ collections: [...currentCollections, newCollection] });
      }
      setTagInput("");
    }
  };

  const removeCustomCollection = (collectionToRemove) => {
    const currentCollections = formData.collections || [];
    updateFormData({ collections: currentCollections.filter(col => col !== collectionToRemove) });
  };

  return (
    <div className="animate-in text-black fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Classification</h2>
        <p className="text-[19px] text-gray-500 mt-1">Organize your product to help customers find it easily.</p>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-[13px] font-bold text-gray-800 mb-3">Department</label>
          <div className="flex flex-wrap gap-4">
            {["Women", "Men", "Kids", "Unisex"].map(dept => (
              <label key={dept} className={`flex items-center justify-center px-6 py-2.5 rounded-lg border cursor-pointer transition-all ${formData.department === dept ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                <input
                  type="radio"
                  name="department"
                  value={dept}
                  checked={formData.department === dept}
                  onChange={(e) => updateFormData({ department: e.target.value })}
                  className="hidden"
                />
                <span className="text-sm">{dept}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="block text-[13px] font-bold text-gray-800 mb-3">Collections</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLLECTIONS.map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => toggleArrayItem('collections', col)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${formData.collections?.includes(col) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="block text-[13px] font-bold text-gray-800 mb-3">Custom Collections</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddCustomCollection}
                placeholder="Type collection and press enter..."
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomCollection}
                className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            {formData.collections?.filter(col => !AVAILABLE_COLLECTIONS.includes(col)).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.collections.filter(col => !AVAILABLE_COLLECTIONS.includes(col)).map(col => (
                  <span key={col} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium bg-gray-200 text-gray-800 border border-gray-300">
                    {col}
                    <button type="button" onClick={() => removeCustomCollection(col)} className="hover:text-red-500 focus:outline-none">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 italic">No custom collections added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}