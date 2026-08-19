"use client";

import { useState } from "react";
import { useWizard } from "./WizardContext";
import { X, Plus } from "lucide-react";

const AVAILABLE_CATEGORIES = ["Women", "Men", "Kids", "Sarees", "Lehengas", "Kurtis", "Ethnic Wear", "Wedding Wear", "Western Wear"];
const AVAILABLE_COLLECTIONS = ["New Arrivals", "Bridal Edit", "Festive Collection", "Summer Collection", "Winter Wear"];
const AVAILABLE_OCCASIONS = ["Wedding", "Reception", "Festive", "Party", "Casual", "Office Wear"];

export default function Step3Classification() {
  const { formData, updateFormData } = useWizard();
  const [tagInput, setTagInput] = useState("");

  const toggleArrayItem = (field, item) => {
    const currentArray = formData[field];
    if (currentArray.includes(item)) {
      updateFormData({ [field]: currentArray.filter(i => i !== item) });
    } else {
      updateFormData({ [field]: [...currentArray, item] });
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        updateFormData({ tags: [...formData.tags, newTag] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    updateFormData({ tags: formData.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="animate-in text-black fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Classification</h2>
        <p className="text-[13px] text-gray-500 mt-1">Organize your product to help customers find it easily.</p>
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
            <label className="block text-[13px] font-bold text-gray-800 mb-3">Categories</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  type="button"
                  onClick={() => toggleArrayItem('categories', cat)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${formData.categories.includes(cat) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="block text-[13px] font-bold text-gray-800 mb-3">Collections</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLLECTIONS.map(col => (
                <button 
                  key={col} 
                  type="button"
                  onClick={() => toggleArrayItem('collections', col)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${formData.collections.includes(col) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="block text-[13px] font-bold text-gray-800 mb-3">Occasions</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_OCCASIONS.map(occ => (
                <button 
                  key={occ} 
                  type="button"
                  onClick={() => toggleArrayItem('occasions', occ)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors border ${formData.occasions.includes(occ) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <label className="block text-[13px] font-bold text-gray-800 mb-3">Tags (Custom)</label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press enter..."
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="button" 
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            {formData.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium bg-gray-200 text-gray-800 border border-gray-300">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 focus:outline-none">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 italic">No tags added yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}