"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getBlogCategories, createBlog, uploadImageForEditor } from "@/app/actions/blogs";

const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return {
      upload: () =>
        loader.file.then(async (file) => {
          try {
            const formData = new FormData();
            formData.append("image", file);
            
            const res = await uploadImageForEditor(formData);
            
            if (res.url) {
              return { default: res.url }; 
            } else {
              throw new Error("URL not returned");
            }
          } catch (error) {
            console.error("Image upload failed:", error);
            throw error;
          }
        }),
    };
  };
}

export default function AddBlog() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [ClassicEditor, setClassicEditor] = useState(null);
  
  const [form, setForm] = useState({
    title: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    permalink: "",
    category: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setClassicEditor(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await getBlogCategories();
      setCategories(cats || []);
    };
    fetchCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (image) formData.append("image", image);
    
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    try {
      const res = await createBlog(formData);
      if (res.success) {
        router.push("/admin/blogs");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Add New Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <input
            required
            placeholder="Blog Title"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">Select Category (optional)</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="border border-gray-300 rounded-lg overflow-hidden text-black">
            {ClassicEditor ? (
              <CKEditor
                editor={ClassicEditor}
                data={form.content}
                config={{
                  extraPlugins: [CustomUploadAdapterPlugin],
                  heading: {
                    options: [
                      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                      { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                      { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                      { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                      { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                      { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
                      { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
                    ],
                  },
                }}
                onChange={(event, editor) => {
                  setForm({ ...form, content: editor.getData() });
                }}
              />
            ) : (
              <p className="p-4 text-gray-500">Loading Editor...</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Meta Title"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />
            <input
              placeholder="Keywords (comma separated)"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Meta Description"
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          />

          <input
            required
            placeholder="Permalink / Slug (e.g., my-first-blog)"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, permalink: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}