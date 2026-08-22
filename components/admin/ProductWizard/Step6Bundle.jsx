"use client";

import { useWizard } from "./WizardContext";
import { Plus, Trash2, Upload } from "lucide-react";

export default function Step6Bundle() {
  const { formData, updateFormData } = useWizard();

  const addComponent = () => {
    const newComp = { id: Date.now(), name: "", type: "Top", required: false, price: "", file: null, preview: null };
    updateFormData({ components: [...formData.components, newComp] });
  };

  const removeComponent = (id) => {
    updateFormData({ components: formData.components.filter(c => c.id !== id) });
  };

  const updateComponent = (id, field, value) => {
    updateFormData({
      components: formData.components.map(c => c.id === id ? { ...c, [field]: value } : c)
    });
  };

  const handleImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      updateComponent(id, 'file', file);
      updateComponent(id, 'preview', preview);
    }
  };

  return (
    <div className="animate-in text-black fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Pricing & Complete the Look</h2>
        <p className="text-[19px] text-gray-500 mt-1">Set the global price and upload custom add-ons (Mix & Match) for this product.</p>
      </div>

      {/* Base Pricing Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
        <h3 className="text-[13px] font-bold text-gray-800 mb-4 uppercase tracking-wide">Base Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Base Price (₹) <span className="text-red-500">*</span></label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.basePrice || ""}
              onChange={(e) => updateFormData({ basePrice: e.target.value })}
              className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Sale Price (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.salePrice || ""}
              onChange={(e) => updateFormData({ salePrice: e.target.value })}
              className="w-full text-[13px] border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-[13px] font-bold text-gray-800 mb-4 uppercase tracking-wide">Purchase Type</label>
        <div className="flex flex-col sm:flex-row gap-4">
          {["Single Product", "Product Set", "Bundle"].map((type) => (
            <label
              key={type}
              className={`flex-1 flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.purchaseType === type ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <input
                type="radio"
                name="purchaseType"
                value={type}
                checked={formData.purchaseType === type}
                onChange={(e) => updateFormData({ purchaseType: e.target.value })}
                className="hidden"
              />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.purchaseType === type ? 'border-blue-600' : 'border-gray-300'}`}>
                {formData.purchaseType === type && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
              </div>
              <span className={`text-[14px] font-bold ${formData.purchaseType === type ? 'text-blue-700' : 'text-gray-700'}`}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {formData.purchaseType !== "Single Product" ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-[12px] font-extrabold text-gray-700 uppercase tracking-wider">Custom Add-ons / Components</h3>
            <button
              onClick={addComponent}
              className="text-[12px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add New
            </button>
          </div>

          <div className="p-5">
            {formData.components.length > 0 ? (
              <div className="space-y-4">
                {formData.components.map((comp, idx) => (
                  <div key={comp.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                    
                    {/* Image Upload for Component */}
                    <label className="w-16 h-16 sm:w-14 sm:h-14 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 relative group">
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(comp.id, e)} className="hidden" />
                      {comp.preview ? (
                        <img src={comp.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Upload size={16} className="text-gray-400 group-hover:text-blue-500" />
                      )}
                    </label>

                    <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                      <select 
                        value={comp.type} 
                        onChange={(e) => updateComponent(comp.id, 'type', e.target.value)}
                        className="w-full sm:w-[120px] text-[13px] border border-gray-300 rounded-md px-2 py-2 outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="Top">Top</option>
                        <option value="Bottom">Bottom</option>
                        <option value="Blouse">Blouse</option>
                        <option value="Dupatta">Dupatta</option>
                        <option value="Jacket">Jacket</option>
                        <option value="Accessories">Accessories</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Add-on Name (e.g. Black Shrug)"
                        value={comp.name}
                        onChange={(e) => updateComponent(comp.id, 'name', e.target.value)}
                        className="flex-1 text-[13px] border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="w-full sm:w-28">
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={comp.price}
                        onChange={(e) => updateComponent(comp.id, 'price', e.target.value)}
                        className="w-full text-[13px] border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>

                    <button
                      onClick={() => removeComponent(comp.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors w-full sm:w-auto flex justify-center cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[13px] text-gray-500 font-medium">No custom add-ons added yet.</p>
                <button onClick={addComponent} className="mt-3 px-4 py-2 bg-gray-100 text-gray-700 font-bold text-[12px] rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                  Click here to create an add-on
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <h3 className="text-[14px] font-bold text-gray-800 mb-1">Standard Single Product</h3>
          <p className="text-[13px] text-gray-500 max-w-md mx-auto">This product will be sold as a single unit without custom add-ons.</p>
        </div>
      )}
    </div>
  );
}