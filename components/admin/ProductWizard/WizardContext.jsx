"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPremiumProduct, updatePremiumProduct } from "@/app/actions/admin";

const WizardContext = createContext();

const parseArrayData = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    let str = value.trim();
    
    while (str.startsWith('"') && str.endsWith('"')) {
      try { str = JSON.parse(str); } catch (e) { break; }
    }

    if (str.startsWith('[') && str.endsWith(']')) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }

    if (str.startsWith('{') && str.endsWith('}')) {
      str = str.slice(1, -1);
    }

    return str.split(',')
      .map(s => s.replace(/^[\\"']+|[\\"']+$/g, '').trim())
      .filter(Boolean);
  }
  
  return [];
};

export function WizardProvider({ children, initialData }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 10;

  const defaultData = {
    title: "", productType: "Saree", brand: "Srijan Fashion", shortDesc: "",
    description: "", materialCare: "", highlights: "", additionalInfo: "",
    department: "Women", categories: [], collections: [], occasions: [], tags: [],
    images: [],
    variants: [{ id: Date.now(), size: "Free Size", color: "", sku: "", stock: "10", lowStock: "5", barcode: "" }],
    basePrice: "", salePrice: "",
    purchaseType: "Single Product", 
    components: [], // CRITICAL FIX: Added components back here
    productAddons: [],
    weight: "", length: "", width: "", height: "", shippingClass: "Standard", estimatedDelivery: "3-5 Days", isCodAvailable: true, isFreeShipping: false, isReturnEligible: true,
    shippingPolicy: "", returnPolicy: "", faqs: [],
    seoTitle: "", seoSlug: "", metaDesc: "", focusKeyword: "", seoKeywords: "", ogTitle: "", ogDesc: "", canonicalUrl: ""
  };

  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        categories: parseArrayData(initialData.categories),
        collections: parseArrayData(initialData.collections),
        occasions: parseArrayData(initialData.occasions),
        tags: parseArrayData(initialData.tags),
        faqs: parseArrayData(initialData.faqs),
        variants: initialData.variants ? (typeof initialData.variants === 'string' ? JSON.parse(initialData.variants) : initialData.variants) : prev.variants,
        components: initialData.components ? (typeof initialData.components === 'string' ? JSON.parse(initialData.components) : initialData.components) : prev.components,
        productAddons: initialData.productAddons ? (typeof initialData.productAddons === 'string' ? JSON.parse(initialData.productAddons) : initialData.productAddons) : prev.productAddons,
        images: Array.isArray(initialData.images) ? initialData.images : []
      }));
    }
  }, [initialData]);

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
        "highlights", "additionalInfo", "department", "basePrice", "salePrice", "purchaseType", "weight", 
        "length", "width", "height", "shippingClass", "estimatedDelivery", 
        "shippingPolicy", "returnPolicy", "seoTitle", "seoSlug", "metaDesc", 
        "focusKeyword", "seoKeywords", "ogTitle", "ogDesc", "canonicalUrl"
      ];
      
      textFields.forEach(field => submitData.append(field, formData[field] || ""));

      submitData.append("isCodAvailable", formData.isCodAvailable);
      submitData.append("isFreeShipping", formData.isFreeShipping);
      submitData.append("isReturnEligible", formData.isReturnEligible);

      const jsonFields = ["categories", "collections", "occasions", "tags", "variants", "faqs"];
      jsonFields.forEach(field => submitData.append(field, JSON.stringify(formData[field] || [])));

      // Component data and files integration
      const cleanComponents = formData.components.map((c, i) => {
        if (c.file) submitData.append(`comp_file_${i}`, c.file);
        return { id: c.id, name: c.name, type: c.type, required: c.required, price: c.price, preview: c.preview };
      });
      submitData.append("components", JSON.stringify(cleanComponents));
      
      // Keeping productAddons just in case you use the search feature later
      submitData.append("productAddons", JSON.stringify(formData.productAddons || []));

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