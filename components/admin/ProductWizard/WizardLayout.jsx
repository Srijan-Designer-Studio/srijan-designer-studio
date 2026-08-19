"use client";

import { useWizard } from "./WizardContext";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const stepsList = [
  { id: 1, title: "Basic Info", sub: "Name, type, brand" },
  { id: 2, title: "Product Details", sub: "Description, material" },
  { id: 3, title: "Classification", sub: "Categories, collections" },
  { id: 4, title: "Media", sub: "Images, alt text" },
  { id: 5, title: "Variants & Inventory", sub: "Size, color, SKU, price" },
  { id: 6, title: "Bundle / Set", sub: "Set components" },
  { id: 7, title: "Shipping", sub: "Weight, dimensions" },
  { id: 8, title: "Policies & FAQ", sub: "Return policy, FAQ" },
  { id: 9, title: "SEO", sub: "Meta title, keywords" },
  { id: 10, title: "Publish", sub: "Review and publish" }
];

export default function WizardLayout({ children }) {
  const { currentStep, totalSteps, nextStep, prevStep, goToStep } = useWizard();

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans pb-24">
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-[12px] text-gray-500">Create a new product for your store. Fill all details carefully.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors">
              Save Draft
            </button>
            <button className="px-5 py-2 text-[13px] font-bold text-gray-700 border border-gray-300 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              Preview
            </button>
            <button onClick={nextStep} className="px-5 py-2 text-[13px] font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              {currentStep === totalSteps ? "Publish" : "Next"} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Top Stepper Line */}
        <div className="max-w-[1400px] mx-auto px-6 py-4 hidden md:flex items-center justify-between relative">
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 -z-10"></div>
          {stepsList.map((step) => (
            <div key={step.id} onClick={() => goToStep(step.id)} className="flex flex-col items-center gap-2 cursor-pointer bg-white px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                currentStep === step.id ? "bg-blue-600 text-white ring-4 ring-blue-100" : 
                currentStep > step.id ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 border border-gray-300"
              }`}>
                {currentStep > step.id ? <Check size={14} strokeWidth={3} /> : step.id}
              </div>
              <span className={`text-[11px] font-bold ${currentStep === step.id ? "text-blue-600" : "text-gray-500"}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Steps */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-6 ml-2">Steps</h3>
          <div className="space-y-1 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-200">
            {stepsList.map((step) => (
              <div 
                key={step.id} 
                onClick={() => goToStep(step.id)}
                className={`relative flex gap-4 p-3 rounded-xl cursor-pointer transition-colors ${currentStep === step.id ? "bg-white shadow-sm border border-blue-100" : "hover:bg-gray-50"}`}
              >
                <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center z-10 text-[13px] font-bold ${
                  currentStep === step.id ? "bg-blue-600 text-white shadow-md shadow-blue-200" : 
                  currentStep > step.id ? "bg-green-50 text-green-600 border border-green-200" : "bg-white border border-gray-300 text-gray-500"
                }`}>
                  {currentStep > step.id ? <Check size={16} strokeWidth={3} /> : step.id}
                </div>
                <div>
                  <h4 className={`text-[13px] font-bold mb-0.5 ${currentStep === step.id ? "text-blue-600" : "text-gray-800"}`}>{step.title}</h4>
                  <p className="text-[11px] text-gray-500 leading-tight">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Content */}
        <div className="flex-1 max-w-[1000px]">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[600px]">
              {children}
           </div>

           {/* Bottom Fixed Nav */}
           <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40 lg:hidden">
              <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                <button onClick={prevStep} disabled={currentStep === 1} className="px-5 py-2.5 text-[13px] font-bold text-gray-700 bg-gray-100 rounded-lg disabled:opacity-50">
                  Previous
                </button>
                <button onClick={nextStep} className="px-6 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  {currentStep === totalSteps ? "Publish" : "Next"} <ArrowRight size={16} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}