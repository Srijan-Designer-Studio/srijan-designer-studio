'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Image as ImgIcon, Edit2, ShoppingBag, Loader2 } from "lucide-react";
import { deleteProduct, getAdminProducts } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

export default function ProductsClientWrapper({ initialProducts, categories }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    router.refresh();
    setProducts(initialProducts);
  }, [initialProducts, router]);

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(productId);
      startTransition(async () => {
        const res = await deleteProduct(productId);

        if (res?.error) {
          alert("Failed to delete product: " + res.error);
          setDeletingId(null);
          return;
        }

        const updatedData = await getAdminProducts();
        setProducts(updatedData || []);
        setDeletingId(null);
        router.refresh(); 
      });
    }
  };

  const formattedProducts = products?.map(product => {
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
  }) || [];

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
              {formattedProducts.length > 0 ? formattedProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                        {product.rawProduct.product_images?.[0]?.image_url ?
                          <img src={product.rawProduct.product_images[0].image_url} alt="" className="w-full h-full object-cover" /> :
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><ImgIcon size={20} /></div>
                        }
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-900 mb-0.5">{product.name}</p>
                        <p className="text-[11px] text-gray-500">SKU: {product.sku}</p>
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
                        onClick={() => handleDeleteProduct(product.id)}
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
      </div>
    </div>
  );
}