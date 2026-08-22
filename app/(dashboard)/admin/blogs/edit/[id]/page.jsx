"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getBlogCategories, getBlogById, updateBlog, uploadImageForEditor } from "@/app/actions/blogs";

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

export default function EditBlog({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    existing_image: "",
    author: "Admin", // Default
    published_at: "", // Custom Date
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setClassicEditor(() => mod.default);
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      const cats = await getBlogCategories();
      setCategories(cats || []);

      const blog = await getBlogById(id);
      if (blog) {
        setForm({
          title: blog.title || "",
          content: blog.content || "",
          metaTitle: blog.meta_title || "",
          metaDescription: blog.meta_description || "",
          keywords: blog.keywords || "",
          permalink: blog.slug || "",
          category: blog.category_id || "",
          existing_image: blog.image_url || "",
          // CRITICAL FIX: Load Author and format Published Date for the input
          author: blog.author || "Admin",
          published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : "",
        });
      }
      setFetching(false);
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (image) formData.append("image", image);
    formData.append("existing_image", form.existing_image);
    
    Object.keys(form).forEach((key) => {
      if (key !== "existing_image") {
        if (form[key]) {
          formData.append(key, form[key]);
        }
      }
    });

    try {
      const res = await updateBlog(id, formData);
      if (res.success) {
        router.push("/admin/blogs");
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-gray-500">Loading blog details...</div>;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-sm border rounded-2xl p-8">
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold text-gray-800 mb-8">Edit Blog</h2>

        <form onSubmit={handleSubmit} className="space-y-6 text-black">
          <input
            required
            placeholder="Blog Title"
            value={form.title}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Author Name</label>
              <input
                type="text"
                placeholder="e.g. Admin or Radley"
                value={form.author}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date & Time</label>
              <input
                type="datetime-local"
                value={form.published_at}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              />
              <p className="text-[11px] text-gray-400 mt-1">Leave blank to use current time</p>
            </div>
          </div>

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

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Cover Image</label>
            {form.existing_image && !image && (
              <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-gray-200">
                <Image src={form.existing_image} alt="Cover" fill className="object-cover" unoptimized />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 w-full"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

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
              value={form.metaTitle}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
            />
            <input
              placeholder="Keywords (comma separated)"
              value={form.keywords}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
          </div>

          <textarea
            placeholder="Meta Description"
            rows="3"
            value={form.metaDescription}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
          />

          <input
            required
            placeholder="Permalink / Slug (e.g., my-first-blog)"
            value={form.permalink}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setForm({ ...form, permalink: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center cursor-pointer
            ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}