"use client";

import { useWizard } from "./WizardContext";
import RichTextEditor from "./RichTextEditor";

export default function Step2Details() {
  const { formData, updateFormData } = useWizard();

  return (
    <div className="animate-in text-black fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
        <p className="text-[19px] text-gray-500 mt-1">Provide detailed information and highlights about your product.</p>
      </div>

      <div className="space-y-2">
        <RichTextEditor
          label="Description *"
          placeholder="Introducing the Royal Crimson Banarasi Silk Saree..."
          value={formData.description}
          onChange={(val) => updateFormData({ description: val })}
        />

        <RichTextEditor
          label="Material & Care"
          placeholder="Material: Premium Banarasi Silk&#10;Work: Golden Zari..."
          value={formData.materialCare}
          onChange={(val) => updateFormData({ materialCare: val })}
        />

        <RichTextEditor
          label="Highlights / Features"
          placeholder="• Premium Banarasi Silk&#10;• Traditional Zari Work..."
          value={formData.highlights}
          onChange={(val) => updateFormData({ highlights: val })}
        />

        <RichTextEditor
          label="Additional Information (Optional)"
          placeholder="Any extra details, styling tips or origin information..."
          value={formData.additionalInfo}
          onChange={(val) => updateFormData({ additionalInfo: val })}
        />
      </div>
    </div>
  );
}