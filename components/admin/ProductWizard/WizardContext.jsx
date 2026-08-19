"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { createPremiumProduct, updatePremiumProduct } from "@/app/actions/admin";

const WizardContext = createContext();

export function WizardProvider({ children, initialData }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 10;

  const [formData, setFormData] = useState(initialData || {
    title: "", productType: "Saree", brand: "Srijan Fashion", shortDesc: "",
    description: "", materialCare: "", highlights: "", additionalInfo: "",
    department: "Women", categories: [], collections: [], occasions: [], tags: [],
    images: [],
    variants: [{ id: Date.now(), size: "Free Size", color: "", price: "", salePrice: "", sku: "", stock: "10", lowStock: "5", barcode: "" }],
    purchaseType: "Single Product", components: [],
    weight: "", length: "", width: "", height: "", shippingClass: "Standard", estimatedDelivery: "3-5 Days", isCodAvailable: true, isFreeShipping: false, isReturnEligible: true,
    shippingPolicy: "", returnPolicy: "", faqs: [],
    seoTitle: "", seoSlug: "", metaDesc: "", focusKeyword: "", seoKeywords: "", ogTitle: "", ogDesc: "", canonicalUrl: ""
  });

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, totalSteps));
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 1));
  const goToStep = (step) => setCurrentStep(step);

  const publishProduct = async () => {
    setIsSubmitting(true);
    try {
      const submitData = new FormData();

      const textFields = [
        "title", "productType", "brand", "shortDesc", "description", "materialCare", 
        "highlights", "additionalInfo", "department", "purchaseType", "weight", 
        "length", "width", "height", "shippingClass", "estimatedDelivery", 
        "shippingPolicy", "returnPolicy", "seoTitle", "seoSlug", "metaDesc", 
        "focusKeyword", "seoKeywords", "ogTitle", "ogDesc", "canonicalUrl"
      ];
      
      textFields.forEach(field => submitData.append(field, formData[field] || ""));

      submitData.append("isCodAvailable", formData.isCodAvailable);
      submitData.append("isFreeShipping", formData.isFreeShipping);
      submitData.append("isReturnEligible", formData.isReturnEligible);

      const jsonFields = ["categories", "collections", "occasions", "tags", "variants", "components", "faqs"];
      jsonFields.forEach(field => submitData.append(field, JSON.stringify(formData[field])));

      formData.images.forEach((img, idx) => {
        if (img.file) {
          submitData.append(`image_file_${idx}`, img.file);
          submitData.append(`image_alt_${idx}`, img.altText || "");
          submitData.append(`image_primary_${idx}`, img.isPrimary);
        } else if (img.preview) {
          submitData.append(`existing_image_url_${idx}`, img.preview);
          submitData.append(`existing_image_alt_${idx}`, img.altText || "");
          submitData.append(`existing_image_primary_${idx}`, img.isPrimary);
        }
      });

      let result;
      if (formData.id) {
        submitData.append("productId", formData.id);
        result = await updatePremiumProduct(submitData);
      } else {
        result = await createPremiumProduct(submitData);
      }
      
      if (result?.success) {
        router.push("/admin/products");
      } else {
        alert(result?.error || "Error publishing product");
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <WizardContext.Provider value={{ currentStep, totalSteps, formData, isSubmitting, updateFormData, nextStep, prevStep, goToStep, publishProduct }}>
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => useContext(WizardContext);