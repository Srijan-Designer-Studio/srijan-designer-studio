'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Image as ImgIcon, Edit2, ShoppingBag, Loader2, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { deleteProduct } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function ProductsClientWrapper({ initialProducts, categories }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const itemsPerPage = 10;

  const products = initialProducts || [];

  const confirmDelete = (productId) => {
    setConfirmDeleteId(productId);
  };

  const executeDelete = () => {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    
    startTransition(async () => {
      const res = await deleteProduct(confirmDeleteId);
      if (res?.error) {
        alert("Failed to delete product: " + res.error);
        setDeletingId(null);
        setConfirmDeleteId(null);
        return;
      }
      setDeletingId(null);
      setConfirmDeleteId(null);
      router.refresh(); 
    });
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formattedProducts = products.map(product => {
    const mainVariant = product.product_variants?.[0];
    const totalStock = product.product_variants?.reduce((sum, v) => sum + (v.inventory_count || 0), 0) || 0;
    const basePrice = product.base_price || 0;

    return {
      rawProduct: product,
      id: product.id,
      slug: product.slug || product.id,
      name: product.title,
      sku: mainVariant?.sku || 'N/A',
      price: basePrice,
      stock: totalStock,
      stockStatus: totalStock > 20 ? 'In Stock' : totalStock > 0 ? `Low Stock (${totalStock})` : 'Out of Stock',
      status: !product.is_active ? 'Draft' : 'Published'
    };
  });

  const totalItems = formattedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages === 0 ? 1 : totalPages));
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const currentProducts = formattedProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10 text-black">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-[#5a4bda]">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Products</h1>
            <p className="text-[19px] text-gray-500 mt-0.5">Manage your store's inventory and product catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/add"
            className="px-4 py-2 bg-[#5a4bda] text-white rounded-lg text-[13px] font-bold hover:bg-[#4b3ec2] shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add New Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-4 flex items-center gap-1 cursor-pointer">PRODUCT</th>
                <th className="px-4 py-4">PRICE</th>
                <th className="px-4 py-4">STOCK</th>
                <th className="px-4 py-4 text-center">STATUS</th>
                <th className="px-4 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentProducts.length > 0 ? currentProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                        {product.rawProduct.product_images?.[0]?.image_url ?
                          <img src={product.rawProduct.product_images[0].image_url} alt="" className="w-full h-full object-cover object-top" /> :
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><ImgIcon size={20} /></div>
                        }
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900 mb-0.5">{product.name}</p>
                        <p className="text-[11px] text-gray-500">SKU: {product.sku}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[10px] text-gray-400 font-mono">ID: {product.id}</p>
                          <button
                            onClick={() => handleCopy(product.id)}
                            className="text-gray-400 hover:text-[#5a4bda] transition-colors cursor-pointer"
                            title="Copy UUID"
                          >
                            {copiedId === product.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[19px] font-bold text-gray-900 mb-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className={`text-[11px] font-bold ${product.stockStatus === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stockStatus}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold rounded-full border ${product.status === 'Published' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Link
                        href={`/admin/products/edit/${product.slug}`}
                        className="text-gray-400 hover:text-[#5a4bda] transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 size={16} strokeWidth={2.5} />
                      </Link>
                      <button
                        disabled={deletingId === product.id}
                        onClick={() => confirmDelete(product.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete Product"
                      >
                        {deletingId === product.id ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-gray-500 text-sm">
                    No products found. Add a new product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium mb-4 sm:mb-0">
              Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
            </p>
            <div className="flex items-center gap-2">
              <div className="inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() => handlePageChange(Math.max(1, safeCurrentPage - 1))}
                  disabled={safeCurrentPage === 1}
                  className="flex items-center justify-center px-3 py-2 text-gray-400 bg-white border border-gray-200 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-bold border focus:outline-none transition-colors cursor-pointer ${
                      safeCurrentPage === page
                        ? 'bg-[#5a4bda] text-white border-[#5a4bda] z-10 relative shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, safeCurrentPage + 1))}
                  disabled={safeCurrentPage === totalPages || totalPages === 0}
                  className="flex items-center justify-center px-3 py-2 text-gray-400 bg-white border border-gray-200 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={28} />
              </div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-[13px] text-gray-500 mb-6 px-2">
                Are you sure you want to delete this product? This action cannot be undone and will permanently remove it from your store.
              </p>
              <div className="flex w-full gap-3">
                <button
                  disabled={isPending && deletingId === confirmDeleteId}
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[13px] font-bold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending && deletingId === confirmDeleteId}
                  onClick={executeDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isPending && deletingId === confirmDeleteId ? <Loader2 size={16} className="animate-spin" /> : null}
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}