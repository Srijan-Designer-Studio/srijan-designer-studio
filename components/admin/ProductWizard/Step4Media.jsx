"use client";

import { useWizard } from "./WizardContext";
import { UploadCloud, X, Star, Image as ImgIcon } from "lucide-react";

export default function Step4Media() {
  const { formData, updateFormData } = useWizard();

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map((file, index) => ({
        id: Date.now() + index,
        file: file,
        preview: URL.createObjectURL(file),
        altText: formData.title || "",
        isPrimary: formData.images.length === 0 && index === 0
      }));
      updateFormData({ images: [...formData.images, ...newImages] });
    }
    e.target.value = null;
  };

  const removeImage = (idToRemove) => {
    const updatedImages = formData.images.filter(img => img.id !== idToRemove);
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true;
    }
    updateFormData({ images: updatedImages });
  };

  const setPrimaryImage = (idToSet) => {
    const updatedImages = formData.images.map(img => ({
      ...img,
      isPrimary: img.id === idToSet
    }));
    updateFormData({ images: updatedImages });
  };

  const updateAltText = (idToUpdate, newAltText) => {
    const updatedImages = formData.images.map(img => 
      img.id === idToUpdate ? { ...img, altText: newAltText } : img
    );
    updateFormData({ images: updatedImages });
  };

  return (
    <div className="animate-in fade-in text-black slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Media</h2>
        <p className="text-[13px] text-gray-500 mt-1">Upload high-quality images. You can select a primary image and add alt texts for SEO.</p>
      </div>

      <div className="space-y-6">
        <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud size={40} className="text-gray-400 group-hover:text-blue-500 transition-colors mb-3" />
            <p className="mb-2 text-sm text-gray-700 font-semibold"><span className="text-blue-600">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (Max 5MB per image)</p>
          </div>
          <input type="file" className="hidden" multiple accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
        </label>

        {formData.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {formData.images.map((img) => (
              <div key={img.id} className={`relative flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${img.isPrimary ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'}`}>
                
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button 
                    type="button" 
                    onClick={() => setPrimaryImage(img.id)}
                    title="Set as Primary"
                    className={`p-1.5 rounded-md shadow-sm transition-colors ${img.isPrimary ? 'bg-blue-600 text-white' : 'bg-white text-gray-400 hover:text-blue-600'}`}
                  >
                    <Star size={16} className={img.isPrimary ? 'fill-white' : ''} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => removeImage(img.id)}
                    title="Delete Image"
                    className="p-1.5 rounded-md shadow-sm bg-white text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {img.isPrimary && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10 uppercase tracking-wider">
                    Primary
                  </div>
                )}

                <div className="w-full aspect-[4/5] bg-gray-100 relative group">
                  <img src={img.preview} alt={img.altText || "Product preview"} className="w-full h-full object-cover object-top" />
                </div>

                <div className="p-3 bg-gray-50 border-t border-gray-100">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Alt Text (SEO)</label>
                  <input 
                    type="text" 
                    value={img.altText}
                    onChange={(e) => updateAltText(img.id, e.target.value)}
                    placeholder="Describe this image"
                    className="w-full text-[13px] border border-gray-300 rounded-md px-3 py-1.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-white border border-gray-200 border-dashed rounded-xl">
            <ImgIcon size={48} strokeWidth={1} className="text-gray-300 mb-3" />
            <p className="text-[14px] font-medium text-gray-500">No images uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}