"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { Loader2, Plus, Trash2, Search, Filter } from "lucide-react";
import { getAdminBlogs, createBlog, deleteBlog } from "@/app/actions/admin-blogs";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const data = await getAdminBlogs();
    setBlogs(data || []);
    setIsLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      const res = await createBlog(formData);
      if (res.success) {
        setIsModalOpen(false);
        setImagePreview(null);
        fetchBlogs();
      } else {
        alert("Failed to upload blog: " + res.error);
      }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      startTransition(async () => {
        await deleteBlog(id);
        fetchBlogs();
      });
    }
  };


  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = (blog.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || blog.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">Upload, search and filter your fashion blogs.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-md cursor-pointer"
        >
          <Plus size={18} />
          Write New Blog
        </button>
      </div>

     
      {!isLoading && blogs.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search blogs by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00c3ff]/20 focus:border-[#00c3ff] transition-all text-sm text-gray-700"
            />
          </div>
          
          {/* Category Dropdown */}
          <div className="relative sm:w-64 shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00c3ff]/20 focus:border-[#00c3ff] transition-all text-sm text-gray-700 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Fashion Trends">Fashion Trends</option>
              <option value="Styling Guides">Styling Guides</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
              <option value="Company News">Company News</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Uncategorized">Uncategorized</option>
            </select>
            <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      )}

      {/* 3. Blogs Display Area */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00c3ff]" size={40} /></div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">No blogs uploaded yet. Start writing your first blog!</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-lg">No blogs found matching your search.</p>
          <button 
            onClick={() => { setSearchQuery(""); setCategoryFilter("All"); }}
            className="mt-3 text-[#00c3ff] font-bold text-sm hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
              
              <div className="relative w-full h-[200px] bg-gray-50 shrink-0 border-b border-gray-100 overflow-hidden">
                <img
                  src={blog.image_url || '/images/placeholder.jpg'} 
                  alt={blog.title || 'Blog Image'} 
                  width={600}
                  height={300}
                  className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-500" 
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00c3ff] mb-3 bg-[#00c3ff]/10 w-max px-2.5 py-1 rounded-md">
                  {blog.category || 'Uncategorized'}
                </span>
                
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{blog.title || 'Untitled Blog'}</h3>
                <p className="text-xs text-gray-500 mb-5 flex-1">By {blog.author || 'Admin'}</p>
                
                <button
                  onClick={() => handleDelete(blog.id)}
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-lg transition-colors cursor-pointer mt-auto shrink-0"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Blog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Write a New Blog</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Blog Cover Image *</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>
                  <input required name="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#00c3ff]/10 file:text-[#00c3ff] hover:file:bg-[#00c3ff]/20 cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Blog Title *</label>
                <input required name="title" type="text" placeholder="e.g. Top 10 Fashion Trends in 2026" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:border-transparent outline-none text-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                  <select required name="category" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:border-transparent outline-none text-black bg-white">
                    <option value="">Select Category</option>
                    <option value="Fashion Trends">Fashion Trends</option>
                    <option value="Styling Guides">Styling Guides</option>
                    <option value="Tips & Tricks">Tips & Tricks</option>
                    <option value="Company News">Company News</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Author Name</label>
                  <input name="author" type="text" defaultValue="Admin" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:border-transparent outline-none text-black" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Blog Content *</label>
                <textarea required name="content" rows="6" placeholder="Write your blog content here..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:border-transparent outline-none text-black resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-white bg-[#00c3ff] hover:bg-[#00abe0] transition-colors shadow-md disabled:opacity-70 cursor-pointer">
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {isPending ? 'Publishing...' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}