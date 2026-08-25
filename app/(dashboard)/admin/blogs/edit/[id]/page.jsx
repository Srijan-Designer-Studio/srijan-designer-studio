"use client";

import { useState, useEffect, use } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getBlogCategories, getBlogById, updateBlog, uploadImageForEditor } from "@/app/actions/blogs";

const CKEditor = dynamic(() => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor), { ssr: false });

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

export default function EditBlog({ params }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const id = resolvedParams?.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [ClassicEditor, setClassicEditor] = useState(null);

  const [form, setForm] = useState({
    title: "", content: "", metaTitle: "", metaDescription: "", keywords: "", permalink: "", category: "",
    existing_image: "", author: "Admin", published_at: "", cover_img_alt: "", canonical_tag: "", schema_markup: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => { import("@ckeditor/ckeditor5-build-classic").then((mod) => setClassicEditor(() => mod.default)); }, []);

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      const cats = await getBlogCategories();
      setCategories(cats || []);
      
      if (!id) return;
      
      const blog = await getBlogById(id);
      if (blog) {
        let pubDate = "";
        // 🔥 Safe Date Parsing for old data
        if (blog.published_at) {
          try {
            const d = new Date(blog.published_at);
            if (!isNaN(d.getTime())) {
              pubDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            }
          } catch (e) {
            console.error("Invalid date format in old data");
          }
        }

        setForm({
          title: blog.title || "", 
          content: blog.content || "", 
          metaTitle: blog.meta_title || "",
          metaDescription: blog.meta_description || "", 
          keywords: blog.keywords || "",
          permalink: blog.slug || "", 
          category: blog.category_id || "", 
          existing_image: blog.image_url || "",
          author: blog.author || "Admin", 
          published_at: pubDate, 
          cover_img_alt: blog.cover_img_alt || "",
          canonical_tag: blog.canonical_tag || "", 
          schema_markup: blog.schema_markup || ""
        });
      }
      setFetching(false);
    };
    loadData();
  }, [id]);

  const handleSchemaFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setForm({ ...form, schema_markup: event.target.result });
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("blog_id", id); 
      if (image) formData.append("image", image);
      formData.append("existing_image", form.existing_image || "");
      
      Object.keys(form).forEach((key) => {
        if (key !== "existing_image") {
          if (key === "published_at" && form[key]) {
            // 🔥 Prevent crash if old date is manipulated
            const parsedDate = new Date(form[key]);
            if (!isNaN(parsedDate.getTime())) {
              formData.append(key, parsedDate.toISOString());
            }
          } else {
            formData.append(key, form[key] || "");
          }
        }
      });

      const res = await updateBlog(id, formData);
      if (res?.error) {
        alert("Update Failed: " + res.error); 
        setLoading(false);
      } else if (res?.success) {
        window.location.href = "/admin/blogs"; 
      }
    } catch (err) {
      alert("System Error: " + (err.message || "Failed to update blog"));
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-gray-500">Loading blog details...</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Edit Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <input required placeholder="Blog Title" value={form.title} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setForm({ ...form, title: e.target.value })} />
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Author Name</label>
              <input type="text" placeholder="e.g. Admin or Radley" value={form.author} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date & Time</label>
              <input type="datetime-local" value={form.published_at} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
              <p className="text-[11px] text-gray-400 mt-1">Leave blank to use current time</p>
            </div>
          </div>

          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="">Select Category (optional)</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
              {form.existing_image && !image && (
                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200 mb-3"><Image src={form.existing_image} alt="Cover" fill className="object-cover" unoptimized /></div>
              )}
              <input type="file" accept="image/*" className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white w-full" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image Alt Text</label>
              <input type="text" placeholder="Describe the image for SEO..." value={form.cover_img_alt} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" onChange={(e) => setForm({ ...form, cover_img_alt: e.target.value })} />
            </div>
          </div>

          <div className="border border-gray-300 rounded-lg overflow-hidden text-black">
            {ClassicEditor ? (
              <CKEditor editor={ClassicEditor} data={form.content} config={{ extraPlugins: [CustomUploadAdapterPlugin], heading: { options: [ { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" }, { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" }, { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" }, { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" } ] } }} onChange={(event, editor) => setForm({ ...form, content: editor.getData() })} />
            ) : <p className="p-4 text-gray-500">Loading Editor...</p>}
          </div>

          <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">SEO Settings</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <input placeholder="Meta Title" value={form.metaTitle} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
              <input placeholder="Keywords (comma separated)" value={form.keywords} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
              <input placeholder="Canonical URL" value={form.canonical_tag} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" onChange={(e) => setForm({ ...form, canonical_tag: e.target.value })} />
            </div>
            <textarea placeholder="Meta Description" rows="3" value={form.metaDescription} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white" onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} />
            
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Schema Markup (JSON-LD)</label>
                <label className="text-xs font-semibold bg-white hover:bg-gray-100 text-indigo-600 px-3 py-1.5 rounded-md cursor-pointer transition-colors border border-gray-200 shadow-sm flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  Upload .json file
                  <input type="file" accept=".json,.txt" className="hidden" onChange={handleSchemaFileUpload} />
                </label>
              </div>
              <textarea placeholder="Paste your schema script here or upload a file..." rows="5" value={form.schema_markup} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-900 text-green-400 font-mono text-sm" onChange={(e) => setForm({ ...form, schema_markup: e.target.value })} />
            </div>
          </div>

          <input required placeholder="Permalink / Slug (e.g., my-first-blog)" value={form.permalink} className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setForm({ ...form, permalink: e.target.value })} />
          
          <button type="submit" disabled={loading} className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}