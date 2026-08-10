'use client';

import { useState, useTransition, useRef } from 'react';
import { 
  Upload, Plus, Trash2, X, Search as SearchIcon, ChevronDown, 
  Settings, Bold, Italic, Underline, List, Link as LinkIcon, Image as ImgIcon,
  AlignLeft, Edit2, Download, ShoppingBag, CheckCircle, AlertTriangle, 
  XCircle, IndianRupee, Filter as FilterIcon, Star, Eye, 
  MoreHorizontal, ChevronLeft, ChevronRight
} from "lucide-react";
import { createProduct, updateProduct, deleteProduct, getAdminProducts } from '@/app/actions/admin';

const AVAILABLE_CATEGORIES = ["Women", "Men", "Kids", "Sarees", "Ethnic Wear", "Wedding Wear", "Western Wear"];
const AVAILABLE_OCCASIONS = ["Wedding", "Festive", "Reception", "Party", "Casual"];
const AVAILABLE_COLLECTIONS = ["Bridal Edit", "New Arrivals", "Wedding Collection", "Summer Edit"];

export default function ProductsClientWrapper({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState('basic information');
  const [images, setImages] = useState([]);

  const sectionRefs = {
    'basic information': useRef(null),
    'variants & pricing': useRef(null),
    'bundle / set': useRef(null),
    'images': useRef(null),
    'seo': useRef(null),
    'inventory & shipping': useRef(null),
  };

  const scrollToSection = (tabName) => {
    setActiveTab(tabName);
    const targetRef = sectionRefs[tabName];
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [formData, setFormData] = useState({
    title: "", shortDesc: "", fullDesc: "", brand: "Srijan", productType: "Saree", department: "Women",
    categories: [], occasions: [], collections: [],
    purchaseType: "Single Product", status: "Published",
    seoTitle: "", seoSlug: "", metaDesc: "", focusKeyword: "", seoKeywords: "",
    skuBase: "", lowStockAlert: "5", stockStatus: "In Stock",
    weight: "0.50", length: "30", width: "25", height: "5", shippingClass: "Standard", estimatedDelivery: "3 - 5 Days",
    components: [],
    variants: []
  });

  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setImages([]);
    setFormData({
      title: "", shortDesc: "", fullDesc: "", brand: "Srijan", productType: "Saree", department: "Women",
      categories: ["Women", "Sarees"], occasions: [], collections: [],
      purchaseType: "Single Product", status: "Published",
      seoTitle: "", seoSlug: "", metaDesc: "", focusKeyword: "", seoKeywords: "",
      skuBase: "", lowStockAlert: "5", stockStatus: "In Stock",
      weight: "0.50", length: "30", width: "25", height: "5", shippingClass: "Standard", estimatedDelivery: "3 - 5 Days",
      components: [],
      variants: [{ id: Date.now(), size: "Free Size", sku: "", price: "", salePrice: "", stock: "10", weight: "0.50" }]
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    const raw = product.rawProduct;
    setSelectedProduct(raw);
    setModalMode('edit');
    
    const existingImages = raw.product_images?.map(img => ({
      file: null, preview: img.image_url, existingId: img.id
    })) || [];
    setImages(existingImages);

    const variants = raw.product_variants?.map(v => ({
      id: v.id, size: v.size || '', sku: v.sku || '', price: raw.base_price || '', 
      salePrice: v.sale_price || '', stock: v.inventory_count || '0', weight: v.weight || '0.50'
    })) || [];

    setFormData({
      title: raw.title || "", shortDesc: raw.short_description || "", fullDesc: raw.full_description || "", 
      brand: raw.brand || "Srijan", productType: raw.product_type || "Saree", department: raw.department || "Women",
      categories: [], occasions: [], collections: [],
      purchaseType: raw.purchase_type || "Single Product", status: raw.is_active ? "Published" : "Draft",
      seoTitle: raw.seo_title || "", seoSlug: raw.seo_slug || "", metaDesc: raw.meta_desc || "", 
      focusKeyword: raw.focus_keyword || "", seoKeywords: raw.seo_keywords || "",
      skuBase: "", lowStockAlert: "5", stockStatus: "In Stock",
      weight: "0.50", length: "30", width: "25", height: "5", shippingClass: "Standard", estimatedDelivery: "3 - 5 Days",
      components: [],
      variants: variants.length ? variants : [{ id: Date.now(), size: "Free Size", sku: "", price: "", salePrice: "", stock: "10", weight: "0.50" }]
    });

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        await deleteProduct(productId);
        const updatedData = await getAdminProducts();
        setProducts(updatedData || []);
      });
    }
  };

  const toggleArrayItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file, preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addComponent = () => {
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, { id: Date.now(), name: "", required: false, price: "" }]
    }));
  };

  const removeComponent = (id) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.filter(c => c.id !== id)
    }));
  };

  const handleComponentChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      components: prev.components.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: Date.now(), size: "", sku: "", price: "", salePrice: "", stock: "0", weight: "0.50" }]
    }));
  };

  const removeVariant = (id) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== id)
    }));
  };

  const handleVariantChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => v.id === id ? { ...v, [field]: value } : v)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('shortDesc', formData.shortDesc);
    submitData.append('fullDesc', formData.fullDesc);
    submitData.append('brand', formData.brand);
    submitData.append('productType', formData.productType);
    submitData.append('department', formData.department);
    submitData.append('purchaseType', formData.purchaseType);
    submitData.append('status', formData.status);
    submitData.append('seoTitle', formData.seoTitle);
    submitData.append('seoSlug', formData.seoSlug);
    submitData.append('metaDesc', formData.metaDesc);
    submitData.append('focusKeyword', formData.focusKeyword);
    submitData.append('seoKeywords', formData.seoKeywords);
    
    submitData.append('variants', JSON.stringify(formData.variants));
    
    if (formData.purchaseType !== 'Single Product') {
      submitData.append('components', JSON.stringify(formData.components));
    }

    images.forEach((img, idx) => {
      if (img.file) {
        submitData.append(`image_${idx}`, img.file);
      }
    });

    startTransition(async () => {
      let res;
      if (modalMode === 'add') {
        res = await createProduct(submitData);
      } else {
        res = await updateProduct(selectedProduct.id, submitData);
      }
      
      if (res && res.success) {
        const updatedData = await getAdminProducts();
        setProducts(updatedData || []);
        setIsModalOpen(false);
      } else {
        alert(res?.error || "Error saving product");
      }
    });
  };

  const formattedProducts = products?.map(product => {
    const mainVariant = product.product_variants?.[0];
    const totalStock = product.product_variants?.reduce((sum, v) => sum + (v.inventory_count || 0), 0) || 0;
    const basePrice = product.base_price || 0;
    const originalPrice = basePrice + (basePrice * 0.3);
    const badge = product.product_type || 'New';
    
    return {
      rawProduct: product,
      id: product.id,
      name: product.title,
      sku: mainVariant?.sku || 'N/A',
      category: product.categories?.name || 'Uncategorized',
      badge: badge,
      price: basePrice,
      originalPrice: originalPrice,
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
            <p className="text-[13px] text-gray-500 mt-0.5">Manage your store's inventory and product catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Upload size={16} /> Import
          </button>
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-[#5a4bda] text-white rounded-lg text-[13px] font-semibold hover:bg-[#4b3ec2] shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-[#5a4bda]"><ShoppingBag size={20} /></div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Total Products</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold text-gray-900">{products?.length || 0}</h3>
              <span className="text-[11px] font-bold text-green-600 flex items-center">↑ 12.5%</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><CheckCircle size={20} /></div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">In Stock</p>
            <h3 className="text-xl font-bold text-gray-900">{formattedProducts.filter(p=>p.stockStatus==='In Stock').length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500"><AlertTriangle size={20} /></div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Low Stock</p>
            <h3 className="text-xl font-bold text-gray-900">{formattedProducts.filter(p=>p.stockStatus.includes('Low')).length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><XCircle size={20} /></div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Out of Stock</p>
            <h3 className="text-xl font-bold text-gray-900">{formattedProducts.filter(p=>p.stockStatus==='Out of Stock').length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><IndianRupee size={20} /></div>
          <div>
            <p className="text-[12px] font-bold text-gray-500 mb-1">Total Value</p>
            <h3 className="text-xl font-bold text-gray-900">₹--</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between bg-white">
          <div className="relative w-full md:w-[300px]">
            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products by name, SKU, or barcode..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-[#5a4bda] focus:ring-1 focus:ring-[#5a4bda] bg-gray-50/50" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 bg-white outline-none hover:border-gray-300 cursor-pointer">
              <option>All Categories</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 bg-white outline-none hover:border-gray-300 cursor-pointer">
              <option>All Status</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer">
              <FilterIcon size={14} /> More Filters <ChevronDown size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 w-10"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#5a4bda] focus:ring-[#5a4bda]" /></th>
                <th className="px-4 py-4 flex items-center gap-1 cursor-pointer">PRODUCT <ChevronDown size={12}/></th>
                <th className="px-4 py-4 cursor-pointer">CATEGORY <ChevronDown size={12}/></th>
                <th className="px-4 py-4 cursor-pointer">PRICE <ChevronDown size={12}/></th>
                <th className="px-4 py-4 cursor-pointer">STOCK <ChevronDown size={12}/></th>
                <th className="px-4 py-4 text-center cursor-pointer">STATUS</th>
                <th className="px-4 py-4 text-center">FEATURED</th>
                <th className="px-4 py-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formattedProducts.length > 0 ? formattedProducts.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-4"><input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#5a4bda] focus:ring-[#5a4bda]" /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                         {product.rawProduct.product_images?.[0]?.image_url ? 
                           <img src={product.rawProduct.product_images[0].image_url} alt="" className="w-full h-full object-cover" /> :
                           <div className="w-full h-full flex items-center justify-center text-gray-300"><ImgIcon size={20}/></div>
                         }
                      </div>
                      <div>
                        <p onClick={() => handleEditProduct(product)} className="font-bold text-[13px] text-gray-900 mb-0.5 group-hover:text-[#5a4bda] cursor-pointer transition-colors">{product.name}</p>
                        <p className="text-[11px] text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] text-gray-800 font-medium mb-1.5">{product.category}</p>
                    <span className="inline-block px-2 py-0.5 bg-[#f5f3ff] text-[#5a4bda] text-[10px] font-bold rounded">
                      {product.badge}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-bold text-gray-900 mb-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-gray-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-bold text-gray-900 mb-1">{product.stock}</p>
                    <p className={`text-[11px] font-bold ${
                      product.stockStatus === 'In Stock' ? 'text-green-600' : 
                      product.stockStatus === 'Out of Stock' ? 'text-red-500' : 'text-orange-500'
                    }`}>
                      {product.stockStatus}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold rounded-full border ${product.status === 'Published' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Star size={16} className={`mx-auto cursor-pointer ${idx % 3 === 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button className="text-gray-400 hover:text-gray-700 cursor-pointer"><Eye size={16} /></button>
                      <button onClick={() => handleEditProduct(product)} className="text-gray-400 hover:text-[#5a4bda] cursor-pointer"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-gray-500 text-sm">
                    No products found. Add a new product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[13px] text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">{formattedProducts.length}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={16}/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-[13px] font-bold bg-[#5a4bda] text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-50"><ChevronRight size={16}/></button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#f4f5f7] overflow-y-auto flex flex-col font-sans">
          
          <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                  Products <ChevronDown size={12} className="-rotate-90"/> <span className="text-gray-900 font-medium">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" disabled={isPending}>
                  Cancel
                </button>
                <button onClick={(e) => { setFormData({...formData, status: 'Draft'}); handleSubmit(e); }} className="px-4 py-2 text-sm font-medium text-[#5a4bda] bg-white border border-[#5a4bda] rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer" disabled={isPending}>
                  Save Draft
                </button>
                <button onClick={(e) => { setFormData({...formData, status: 'Published'}); handleSubmit(e); }} className="px-5 py-2 text-sm font-medium text-white bg-[#5a4bda] rounded-lg hover:bg-[#4b3ec2] transition-colors flex items-center gap-2 cursor-pointer" disabled={isPending}>
                  {isPending ? 'Saving...' : 'Publish Product'} <ChevronDown size={16} />
                </button>
              </div>
            </div>

            <div className="flex px-6 gap-8 text-sm font-medium text-gray-500 border-t border-gray-100 overflow-x-auto">
              {[
                { name: 'Basic Information', id: 'basic information', icon: Edit2 },
                { name: 'Variants & Pricing', id: 'variants & pricing', icon: Settings },
                { name: 'Bundle / Set', id: 'bundle / set', icon: List },
                { name: 'Images', id: 'images', icon: ImgIcon },
                { name: 'SEO', id: 'seo', icon: SearchIcon },
                { name: 'Inventory & Shipping', id: 'inventory & shipping', icon: Settings },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => scrollToSection(tab.id)}
                    className={`py-3.5 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'border-[#5a4bda] text-[#5a4bda] font-bold' : 'border-transparent hover:text-gray-900'}`}
                  >
                    <IconComponent size={16} />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto w-full pb-20">
            
            <div ref={sectionRefs['basic information']} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 scroll-mt-28">
              <h2 className="text-base font-bold text-gray-900 mb-5">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Product Name *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#5a4bda]" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[13px] font-semibold text-gray-700">Short Description *</label>
                    <span className="text-[11px] text-gray-400">80 / 150</span>
                  </div>
                  <textarea rows="2" value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#5a4bda] resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Full Description *</label>
                  <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
                    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 text-gray-600">
                      <select className="text-xs bg-transparent outline-none font-medium px-1"><option>Paragraph</option></select>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <Bold size={14} className="cursor-pointer hover:text-black" />
                      <Italic size={14} className="cursor-pointer hover:text-black" />
                      <Underline size={14} className="cursor-pointer hover:text-black" />
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <List size={14} className="cursor-pointer hover:text-black" />
                      <AlignLeft size={14} className="cursor-pointer hover:text-black" />
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <LinkIcon size={14} className="cursor-pointer hover:text-black" />
                      <ImgIcon size={14} className="cursor-pointer hover:text-black" />
                    </div>
                    <textarea 
                      rows="5" 
                      value={formData.fullDesc} 
                      onChange={e => setFormData({...formData, fullDesc: e.target.value})} 
                      className="w-full text-sm px-3 py-3 outline-none resize-none border-0 focus:ring-0"
                      placeholder="Write product description here..."
                    ></textarea>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Brand</label>
                    <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#5a4bda]" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Product Type *</label>
                    <input type="text" value={formData.productType} onChange={e => setFormData({...formData, productType: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#5a4bda]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">Department *</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-[#5a4bda]">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 flex flex-col gap-6">
              <h2 className="text-base font-bold text-gray-900">Categories, Occasions & Collections</h2>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Categories *</label>
                <div className="border border-gray-300 rounded-md p-3 flex flex-wrap gap-2">
                  {AVAILABLE_CATEGORIES.map(tag => (
                    <span key={tag} onClick={() => toggleArrayItem('categories', tag)} className={`cursor-pointer inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border ${formData.categories.includes(tag) ? 'bg-[#f5f3ff] text-[#5a4bda] border-[#ede9fe]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5a4bda]'}`}>
                      {tag} {formData.categories.includes(tag) && <X size={12} className="ml-1" />}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Occasions</label>
                <div className="border border-gray-300 rounded-md p-3 flex flex-wrap gap-2">
                  {AVAILABLE_OCCASIONS.map(tag => (
                    <span key={tag} onClick={() => toggleArrayItem('occasions', tag)} className={`cursor-pointer inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border ${formData.occasions.includes(tag) ? 'bg-[#f5f3ff] text-[#5a4bda] border-[#ede9fe]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5a4bda]'}`}>
                      {tag} {formData.occasions.includes(tag) && <X size={12} className="ml-1" />}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Collections</label>
                <div className="border border-gray-300 rounded-md p-3 flex flex-wrap gap-2">
                  {AVAILABLE_COLLECTIONS.map(tag => (
                    <span key={tag} onClick={() => toggleArrayItem('collections', tag)} className={`cursor-pointer inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium border ${formData.collections.includes(tag) ? 'bg-[#f5f3ff] text-[#5a4bda] border-[#ede9fe]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5a4bda]'}`}>
                      {tag} {formData.collections.includes(tag) && <X size={12} className="ml-1" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div ref={sectionRefs['images']} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 scroll-mt-28">
              <h2 className="text-base font-bold text-gray-900 mb-4">Product Images</h2>
              <div>
                <label className="block text-[13px] font-semibold text-gray-700 mb-2">Images Upload</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden relative border border-gray-200 group">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"><X size={14}/></button>
                    </div>
                  ))}
                  <label className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 text-gray-500 hover:text-[#5a4bda] transition-colors">
                    <Plus size={24} className="mb-1" />
                    <span className="text-[11px] font-semibold">Upload</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            </div>

            <div ref={sectionRefs['bundle / set']} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 flex flex-col scroll-mt-28">
              <h2 className="text-base font-bold text-gray-900 mb-4">Purchase Options (Bundle / Set)</h2>
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-gray-700 mb-3">Product Type</label>
                <div className="flex flex-col gap-3">
                  {['Single Product', 'Product Set', 'Bundle'].map((type, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input type="radio" name="productType" value={type} checked={formData.purchaseType === type} onChange={e => setFormData({...formData, purchaseType: e.target.value})} className="w-4 h-4 text-[#5a4bda] focus:ring-[#5a4bda]" />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              
              {formData.purchaseType !== 'Single Product' && (
                <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                    <h3 className="text-[12px] font-bold text-gray-700 uppercase">Set Components</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[11px] text-gray-500 uppercase border-b border-gray-200">
                        <tr>
                          <th className="font-medium px-4 py-2">Component</th>
                          <th className="font-medium px-2 py-2 text-center">Req</th>
                          <th className="font-medium px-2 py-2">Price (₹)</th>
                          <th className="font-medium px-3 py-2 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {formData.components.map((comp) => (
                          <tr key={comp.id}>
                            <td className="px-4 py-2"><input type="text" value={comp.name} onChange={e => handleComponentChange(comp.id, 'name', e.target.value)} className="w-full px-2 py-1 text-xs border border-gray-300 rounded outline-none" placeholder="Name" /></td>
                            <td className="px-2 py-2 text-center"><input type="checkbox" checked={comp.required} onChange={e => handleComponentChange(comp.id, 'required', e.target.checked)} className="w-3.5 h-3.5 text-[#5a4bda] rounded cursor-pointer" /></td>
                            <td className="px-2 py-2"><input type="text" value={comp.price} onChange={e => handleComponentChange(comp.id, 'price', e.target.value)} className="w-16 px-2 py-1 text-xs border border-gray-300 rounded outline-none" placeholder="0" /></td>
                            <td className="px-3 py-2 text-right"><button type="button" onClick={() => removeComponent(comp.id)} className="text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={14}/></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                     <button type="button" onClick={addComponent} className="text-[12px] font-bold text-[#5a4bda] hover:text-[#4b3ec2] flex items-center gap-1 cursor-pointer">
                       <Plus size={14}/> Add Component
                     </button>
                  </div>
                </div>
              )}
            </div>

            <div ref={sectionRefs['variants & pricing']} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 xl:col-span-3 scroll-mt-28">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-gray-900">Variants & Pricing</h2>
                <button type="button" onClick={addVariant} className="text-sm font-semibold text-[#5a4bda] bg-[#f5f3ff] px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1">
                  <Plus size={16}/> Add Size / Variant
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Price (₹)</th>
                      <th className="px-4 py-3">Sale Price</th>
                      <th className="px-4 py-3">Stock</th>
                      <th className="px-4 py-3">Weight(kg)</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.variants.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2"><input type="text" value={v.size} onChange={e => handleVariantChange(v.id, 'size', e.target.value)} className="w-full min-w-[60px] px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-[#5a4bda]" placeholder="Size" /></td>
                        <td className="px-4 py-2"><input type="text" value={v.sku} onChange={e => handleVariantChange(v.id, 'sku', e.target.value)} className="w-full min-w-[100px] px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-[#5a4bda]" placeholder="SKU" /></td>
                        <td className="px-4 py-2"><input type="text" value={v.price} onChange={e => handleVariantChange(v.id, 'price', e.target.value)} className="w-full min-w-[70px] px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-[#5a4bda]" placeholder="0" /></td>
                        <td className="px-4 py-2"><input type="text" value={v.salePrice} onChange={e => handleVariantChange(v.id, 'salePrice', e.target.value)} className="w-full min-w-[70px] px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-[#5a4bda]" placeholder="0" /></td>
                        <td className="px-4 py-2"><input type="number" value={v.stock} onChange={e => handleVariantChange(v.id, 'stock', e.target.value)} className="w-full min-w-[60px] px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-[#5a4bda]" placeholder="0" /></td>
                        <td className="px-4 py-2"><input type="text" value={v.weight} onChange={e => handleVariantChange(v.id, 'weight', e.target.value)} className="w-full min-w-[60px] px-2 py-1.5 text-sm border border-gray-300 rounded outline-none focus:border-[#5a4bda]" placeholder="0.5" /></td>
                        <td className="px-4 py-2 text-right">
                          <button type="button" onClick={() => removeVariant(v.id)} className="text-gray-400 hover:text-red-500 cursor-pointer p-1"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div ref={sectionRefs['seo']} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 scroll-mt-28">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-gray-900">SEO Information</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">SEO Title</label>
                  <input type="text" value={formData.seoTitle} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">SEO Slug</label>
                  <input type="text" value={formData.seoSlug} onChange={e => setFormData({...formData, seoSlug: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none text-[#5a4bda]" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Meta Description</label>
                  <textarea rows="3" value={formData.metaDesc} onChange={e => setFormData({...formData, metaDesc: e.target.value})} className="w-full text-[13px] border border-gray-300 rounded-md px-3 py-1.5 outline-none resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">SEO Keywords</label>
                  <input type="text" value={formData.seoKeywords} onChange={e => setFormData({...formData, seoKeywords: e.target.value})} placeholder="saree, ethnic, wedding" className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none" />
                </div>
              </div>
            </div>

            <div ref={sectionRefs['inventory & shipping']} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 col-span-1 xl:col-span-3 h-max scroll-mt-28">
              <h2 className="text-base font-bold text-gray-900 mb-5">Inventory & Shipping Default</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Length (cm)</label>
                  <input type="text" value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Width (cm)</label>
                  <input type="text" value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Height (cm)</label>
                  <input type="text" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-600 mb-1">Estimated Delivery</label>
                  <input type="text" value={formData.estimatedDelivery} onChange={e => setFormData({...formData, estimatedDelivery: e.target.value})} className="w-full text-sm border border-gray-300 rounded-md px-3 py-1.5 outline-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}