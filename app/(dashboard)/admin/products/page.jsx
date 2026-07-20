'use client';

import { useState, useEffect, useTransition } from 'react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '@/app/actions/admin';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // ইমেজ প্রিভিউ দেখানোর জন্য নতুন স্টেট
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAdminProducts();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setImagePreview(null); // নতুন প্রোডাক্টের সময় প্রিভিউ ক্লিয়ার করা
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product.rawProduct);
    setImagePreview(product.rawProduct.image_url || null); // আগের ইমেজ থাকলে সেটা সেট করা
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        await deleteProduct(productId);
        const updatedData = await getAdminProducts();
        setProducts(updatedData);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    startTransition(async () => {
      if (modalMode === 'add') {
        await createProduct(formData);
      } else {
        await updateProduct(selectedProduct.id, formData);
      }
      const updatedData = await getAdminProducts();
      setProducts(updatedData);
      setIsModalOpen(false);
    });
  };

  // ইমেজ সিলেক্ট করলে প্রিভিউ দেখানোর ফাংশন
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const formattedProducts = products.map(product => {
    const mainVariant = product.product_variants?.[0];
    const totalStock = product.product_variants?.reduce((sum, v) => sum + v.inventory_count, 0) || 0;
    
    return {
      rawProduct: product,
      id: product.id,
      name: product.title,
      sku: mainVariant?.sku || 'N/A',
      category: product.categories?.name || 'Uncategorized',
      price: `₹${product.base_price.toLocaleString('en-IN')}`,
      stock: totalStock,
      status: !product.is_active ? 'Inactive' : totalStock > 0 ? 'Active' : 'Pending'
    };
  });

  const productColumns = [
    { 
      header: 'Product', 
      accessor: 'name', 
      render: (row) => (
        <div className="flex items-center gap-3">
          {/* টেবিলে ছোট করে ইমেজ দেখানোর জন্য */}
          {row.rawProduct.image_url ? (
            <img src={row.rawProduct.image_url} alt={row.name} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">SKU: {row.sku}</p>
          </div>
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
          <button 
            onClick={() => handleDeleteProduct(row.id)}
            className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      ) 
    },
  ];

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Sarees', value: 'sarees' },
    { label: 'Lehengas', value: 'lehengas' },
    { label: 'Kurtas', value: 'kurtas' },
    { label: 'Suits', value: 'suits' },
  ];

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading products...</div>;

  return (
    <div className="space-y-6">
      {/* ... (আগের header এবং Table অংশ ঠিক থাকবে) ... */}
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
        <Table columns={productColumns} data={formattedProducts} />
        <Pagination />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? "Add New Product" : "Edit Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ইমেজ আপলোড সেকশন (নতুন যোগ করা হয়েছে) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-md object-cover border border-gray-200" />
              ) : (
                <div className="w-20 h-20 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <input 
                name="image"
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input 
              name="title"
              type="text" 
              defaultValue={selectedProduct?.title || ""}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input 
                name="sku"
                type="text" 
                defaultValue={selectedProduct?.product_variants?.[0]?.sku || ""}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input 
                name="price"
                type="number" 
                defaultValue={selectedProduct?.base_price || ""}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="categoryId" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="sarees">Sarees</option>
                <option value="lehengas">Lehengas</option>
                <option value="kurtas">Kurtas</option>
                <option value="suits">Suits</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input 
                name="stock"
                type="number" 
                defaultValue={selectedProduct?.product_variants?.[0]?.inventory_count || 0}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70"
            >
              {isPending ? 'Saving...' : modalMode === 'add' ? "Save Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}