'use client';

import { useState, Suspense } from 'react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

function ProductsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const products = [
    { id: 1, name: 'Silk Embroidered Saree', sku: 'SRJ-001', category: 'Sarees', price: '₹12,500', stock: 15, status: 'Active' },
    { id: 2, name: 'Velvet Zari Lehenga', sku: 'SRJ-002', category: 'Lehengas', price: '₹35,000', stock: 2, status: 'Pending' },
    { id: 3, name: 'Cotton Block Print Kurta', sku: 'SRJ-003', category: 'Kurtas', price: '₹2,800', stock: 0, status: 'Inactive' },
    { id: 4, name: 'Bridal Kanjivaram', sku: 'SRJ-004', category: 'Sarees', price: '₹45,000', stock: 8, status: 'Active' },
    { id: 5, name: 'Georgette Anarkali Suit', sku: 'SRJ-005', category: 'Suits', price: '₹8,500', stock: 22, status: 'Active' },
  ];

  const handleAddProduct = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const productColumns = [
    { 
      header: 'Product', 
      accessor: 'name', 
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.name}</p>
          <p className="text-xs text-gray-500">SKU: {row.sku}</p>
        </div>
      ) 
    },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price' },
    { 
      header: 'Stock', 
      accessor: 'stock',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span>{row.stock} in stock</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status === 'Pending' ? 'Low Stock' : row.status === 'Inactive' ? 'Out of Stock' : 'In Stock'} /> 
    },
    { 
      header: 'Actions', 
      accessor: 'action', 
      render: (row) => (
        <div className="flex gap-3">
          <button 
            onClick={() => handleEditProduct(row)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Edit
          </button>
          <button className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors">
            Delete
          </button>
        </div>
      ) 
    },
  ];

  const categoryOptions = [
    { label: 'Sarees', value: 'sarees' },
    { label: 'Lehengas', value: 'lehengas' },
    { label: 'Kurtas', value: 'kurtas' },
    { label: 'Suits', value: 'suits' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store's inventory and catalog.</p>
        </div>
        <button 
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      <Card className="p-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white">
          <Search placeholder="Search products by name or SKU..." />
          <div className="w-full sm:w-auto">
            <Filter options={categoryOptions} defaultValue="All Categories" />
          </div>
        </div>

        <Table columns={productColumns} data={products} />

        <Pagination />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? "Add New Product" : "Edit Product"}
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                alert(`Product ${modalMode === 'add' ? 'added' : 'updated'} successfully!`);
                setIsModalOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {modalMode === 'add' ? "Save Product" : "Save Changes"}
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Silk Saree" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="SRJ-000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Sarees</option>
                <option>Lehengas</option>
                <option>Kurtas</option>
                <option>Suits</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="0" />
            </div>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}