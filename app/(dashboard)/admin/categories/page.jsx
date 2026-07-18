'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, UploadCloud, Image as ImageIcon } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Modal from '@/components/dashboard/shared/Modal';

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [dragActive, setDragActive] = useState(false);

  // Mock Category Data
  const categories = [
    { id: 'CAT-01', name: 'Lehengas', description: 'Bridal and party wear lehengas', count: 124, status: 'Active', image: '/images/man1.png' },
    { id: 'CAT-02', name: 'Sarees', description: 'Silk, cotton, and designer sarees', count: 342, status: 'Active', image: '/images/man1.png' },
    { id: 'CAT-03', name: 'Anarkali Suits', description: 'Premium stitched Anarkali sets', count: 86, status: 'Active', image: '/images/man1.png' },
    { id: 'CAT-04', name: 'Kurta Sets', description: 'Casual and embroidered kurtas', count: 210, status: 'Active', image: '/images/man1.png' },
    { id: 'CAT-05', name: 'Accessories', description: 'Jewelry, bags, and dupattas', count: 0, status: 'Inactive', image: '/images/man1.png' },
  ];

  const handleAddCategory = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

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
            onClick={() => { setModalMode('edit'); setIsModalOpen(true); }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your products into distinct collections.</p>
        </div>
        <button 
          onClick={handleAddCategory}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Main Data Card */}
      <Card className="p-0 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <Search placeholder="Search categories..." />
        </div>
        <Table columns={categoryColumns} data={categories} />
      </Card>

      {/* Add/Edit Category Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? "Create New Category" : "Edit Category"}
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                alert(`Category ${modalMode === 'add' ? 'created' : 'updated'} successfully!`);
                setIsModalOpen(false);
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm"
            >
              Save Category
            </button>
          </>
        }
      >
        <form className="space-y-5">
          
          {/* Image Upload Drag & Drop Zone */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Category Image</label>
            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-2">
                  <UploadCloud size={24} />
                </div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="text-blue-600 hover:underline cursor-pointer">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 2MB)</p>
              </div>
              {/* Hidden file input that would be triggered by clicking the text above */}
              <input type="file" className="hidden" accept="image/*" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Category Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-gray-50 focus:bg-white transition-colors" 
              placeholder="e.g. Bridal Lehengas" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Description</label>
            <textarea 
              rows="3"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-gray-50 focus:bg-white transition-colors resize-none" 
              placeholder="Write a short description for this collection..." 
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Visibility</label>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white cursor-pointer">
              <option value="active">Active (Visible to customers)</option>
              <option value="inactive">Inactive (Hidden from store)</option>
            </select>
          </div>

        </form>
      </Modal>

    </div>
  );
}