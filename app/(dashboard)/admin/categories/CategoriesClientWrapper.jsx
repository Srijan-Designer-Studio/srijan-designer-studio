'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Modal from '@/components/dashboard/shared/Modal';
import { createCategory, updateCategory, deleteCategory, getCategories } from '@/app/actions/admin';
import { uploadProductImage } from '@/app/actions/storage';

export default function CategoriesClientWrapper({ initialCategories }) {
  const [categories, setCategories] = useState(initialCategories || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setImageFile(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category.raw);
    setImageFile(null);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      startTransition(async () => {
        await deleteCategory(id);
        const data = await getCategories();
        setCategories(data);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    startTransition(async () => {
      let imageUrl = selectedCategory?.image_url;

      if (imageFile) {
        const fileData = new FormData();
        fileData.append('image', imageFile);
        const uploadRes = await uploadProductImage(fileData);
        if (uploadRes.success) {
          imageUrl = uploadRes.url;
        }
      }

      formData.append('image_url', imageUrl || '');

      if (modalMode === 'add') {
        await createCategory(formData);
      } else {
        await updateCategory(selectedCategory.id, formData);
      }

      const updatedData = await getCategories();
      setCategories(updatedData);
      setIsModalOpen(false);
    });
  };

  const formattedCategories = categories.map(cat => ({
    raw: cat,
    id: cat.id,
    name: cat.name,
    description: cat.slug,
    count: cat.products?.[0]?.count || 0,
    status: 'Active',
    image: cat.image_url
  }));

  const categoryColumns = [
    { 
      header: 'Category Details', 
      accessor: 'name', 
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
            {row.image ? (
              <Image src={row.image} alt={row.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon size={20} />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500 line-clamp-1 max-w-[200px]">{row.description}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Total Products', 
      accessor: 'count', 
      render: (row) => (
        <span className="font-medium text-gray-900 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
          {row.count} Items
        </span>
      ) 
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    { 
      header: 'Actions', 
      accessor: 'action', 
      render: (row) => (
        <div className="flex gap-3">
          <button 
            onClick={() => handleEditCategory(row)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDeleteCategory(row.id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your products into distinct collections.</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <Card className="p-0 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <Search placeholder="Search categories..." />
        </div>
        <Table columns={categoryColumns} data={formattedCategories} />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? "Create New Category" : "Edit Category"}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Category Image</label>
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) setImageFile(e.dataTransfer.files[0]); }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-2">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  <label className="text-blue-600 hover:underline cursor-pointer">
                    Click to upload
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
                  </label> or drag and drop
                </p>
                <p className="text-xs text-gray-500">{imageFile ? imageFile.name : 'SVG, PNG, JPG or GIF (max. 2MB)'}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Category Name</label>
            <input 
              name="name"
              type="text" 
              defaultValue={selectedCategory?.name || ''}
              required
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-gray-50 focus:bg-white transition-colors" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Slug (URL)</label>
            <input 
              name="slug"
              type="text" 
              defaultValue={selectedCategory?.slug || ''}
              required
              className="w-full px-4 py-2.5 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-gray-50 focus:bg-white transition-colors" 
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm disabled:opacity-70 flex items-center gap-2"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}