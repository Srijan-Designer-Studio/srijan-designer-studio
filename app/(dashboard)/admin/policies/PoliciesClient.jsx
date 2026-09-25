'use client';

import { useState, useTransition, useEffect } from 'react';
import { Save, FileText, Loader2, CheckCircle2, AlertCircle, LayoutList } from 'lucide-react';
import { updatePolicy } from '@/app/actions/policies';
import dynamic from "next/dynamic";
import { uploadImageForEditor } from "@/app/actions/blogs"; 

// Dynamically import CKEditor to avoid SSR issues
const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor), { ssr: false });

// Custom Image Upload Adapter for CKEditor
function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return {
      upload: () => loader.file.then(async (file) => {
        try {
          const formData = new FormData();
          formData.append("image", file);
          const res = await uploadImageForEditor(formData);
          if (res.url) return { default: res.url }; 
          throw new Error("URL not returned");
        } catch (error) { throw error; }
      }),
    };
  };
}

// 1. DYNAMIC DEFAULT LIST ADD KORA HOLO
const DEFAULT_POLICIES = [
  { slug: 'terms-conditions', title: 'Terms & Conditions', content: '' },
  { slug: 'privacy-policy', title: 'Privacy Policy', content: '' },
  { slug: 'return-policy', title: 'Return Policy', content: '' },
  { slug: 'refund-cancellation-policy', title: 'Refund & Cancellation Policy', content: '' },
  { slug: 'customization-policy', title: 'Customization Policy', content: '' },
  { slug: 'shipping-policy', title: 'Shipping Policy', content: '' },
];

export default function PoliciesClient({ initialPolicies = [] }) {
  const [isPending, startTransition] = useTransition();
  
  // Database er data er sathe Default List Merge kora holo
  const [policies, setPolicies] = useState(() => {
    return DEFAULT_POLICIES.map(dp => {
      const existing = initialPolicies?.find(p => p.slug === dp.slug);
      return existing || dp;
    });
  });

  const [activeSlug, setActiveSlug] = useState(policies[0]?.slug);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  
  // CKEditor State
  const [ClassicEditor, setClassicEditor] = useState(null);
  const [editorData, setEditorData] = useState("");

  // Load CKEditor on mount
  useEffect(() => { 
    import("@ckeditor/ckeditor5-build-classic").then((mod) => setClassicEditor(() => mod.default)); 
  }, []);

  const activePolicy = policies.find(p => p.slug === activeSlug) || policies[0];

  // Tab change hole editor er data update hobe
  useEffect(() => {
    setEditorData(activePolicy?.content || "");
  }, [activeSlug, activePolicy?.content]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('slug', activeSlug);
    formData.append('content', editorData); 

    startTransition(async () => {
      const result = await updatePolicy(formData);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Policy saved successfully!' });
        const newTitle = formData.get('title');
        setPolicies(policies.map(p => p.slug === activeSlug ? { ...p, title: newTitle, content: editorData } : p));
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to update policy.' });
      }
      setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
    });
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-10 text-black px-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-[#5a4bda]">
          <FileText size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Policies</h1>
          <p className="text-[14px] text-gray-500 mt-0.5">Fully dynamic manager for Terms, Privacy, Shipping, and Returns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Side: Sidebar for Policy Tabs */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-4 px-2 text-gray-800 border-b border-gray-100 pb-3">
            <LayoutList size={18} className="text-[#5a4bda]" />
            <h3 className="font-bold text-[15px]">Policy Pages</h3>
          </div>
          <div className="space-y-2">
            {policies.map((policy) => (
              <button
                key={policy.slug}
                onClick={() => setActiveSlug(policy.slug)}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-bold text-[13px] transition-all cursor-pointer flex justify-between items-center ${
                  activeSlug === policy.slug 
                    ? 'bg-[#5a4bda] text-white shadow-md' 
                    : 'bg-gray-50 border border-gray-100 text-gray-600 hover:border-[#5a4bda] hover:text-[#5a4bda]'
                }`}
              >
                <span>{policy.title}</span>
                {activeSlug === policy.slug && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: CKEditor Form */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            {feedback.message && (
              <div className={`p-4 rounded-xl text-[14px] font-bold mb-6 flex items-center gap-2 ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                {feedback.message}
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-gray-800 mb-2">Policy Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={activePolicy.title}
                  key={`title-${activeSlug}`} 
                  className="w-full text-[14px] border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#5a4bda] focus:ring-1 focus:ring-[#5a4bda] transition-all bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-800 mb-2 flex justify-between items-end">
                  <span>Page Content (Rich Text Editor)</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden text-black ck-editor-wrapper">
                  {ClassicEditor ? (
                    <CKEditor 
                      editor={ClassicEditor} 
                      data={editorData} 
                      config={{ 
                        extraPlugins: [CustomUploadAdapterPlugin], 
                        heading: { 
                          options: [ 
                            { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" }, 
                            { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" }, 
                            { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" }, 
                            { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" } 
                          ] 
                        } 
                      }} 
                      onChange={(event, editor) => setEditorData(editor.getData())} 
                    />
                  ) : (
                    <p className="p-8 text-gray-500 text-center animate-pulse">Loading Editor...</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-[#5a4bda] hover:bg-[#4b3ec2] text-white font-bold text-[14px] px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#5a4bda]/20 disabled:opacity-70 w-full sm:w-auto"
                >
                  {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {isPending ? 'Saving Changes...' : 'Save Policy Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      <style jsx global>{`
        .ck-editor__editable_inline {
          min-height: 400px !important;
          padding: 20px !important;
        }
      `}</style>
    </div>
  );
}