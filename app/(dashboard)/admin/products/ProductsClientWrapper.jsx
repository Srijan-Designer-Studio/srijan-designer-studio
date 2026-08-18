'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { 
  Upload, Plus, Trash2, X, Search as SearchIcon, ChevronDown, 
  Settings, Bold, Italic, Underline, List, Link as LinkIcon, Image as ImgIcon,
  AlignLeft, Edit2, Download, ShoppingBag, CheckCircle, AlertTriangle, 
  XCircle, IndianRupee, Filter as FilterIcon, Star, Eye, 
  MoreHorizontal, ChevronLeft, ChevronRight
} from "lucide-react";
import { createProduct, updateProduct, deleteProduct, getAdminProducts } from '@/app/actions/admin';

const AVAILABLE_CATEGORIES = ["Women", "Men", "Kids", "Sarees", "Ethnic Wear", "Wedding Wear", "Western Wear"];

const RichTextEditor = ({ label, placeholder, value, onChange }) => {
  const editorRef = useRef(null);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    insertUnorderedList: false,
  });

  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.innerHTML = "";
    } else if (editorRef.current && editorRef.current.innerHTML === "" && value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const checkFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
    });
  };

  const handleInput = () => {
    onChange(editorRef.current.innerHTML);
    checkFormats();
  };

  const format = (command, commandValue = null) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  return (
    <div className="mb-6">
      <label className="block text-[13px] font-bold text-gray-800 mb-2">{label}</label>
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 p-1.5 border-b border-gray-200 bg-gray-50/80 text-gray-600">
          <select 
            onChange={(e) => { 
              if (e.target.value) format('formatBlock', e.target.value); 
              e.target.value = ''; 
            }} 
            className="text-xs bg-transparent outline-none font-bold px-1 py-1 cursor-pointer"
          >
            <option value="">Format...</option>
            <option value="H1">Heading 1</option>
            <option value="H2">Heading 2</option>
            <option value="H3">Heading 3</option>
            <option value="P">Paragraph</option>
          </select>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button type="button" onClick={() => format('bold')} className={`p-1.5 rounded cursor-pointer ${activeFormats.bold ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><Bold size={14} /></button>
          <button type="button" onClick={() => format('italic')} className={`p-1.5 rounded cursor-pointer ${activeFormats.italic ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><Italic size={14} /></button>
          <button type="button" onClick={() => format('underline')} className={`p-1.5 rounded cursor-pointer ${activeFormats.underline ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><Underline size={14} /></button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button type="button" onClick={() => format('justifyLeft')} className={`p-1.5 rounded cursor-pointer ${activeFormats.justifyLeft ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><AlignLeft size={14} /></button>
          <button type="button" onClick={() => format('insertUnorderedList')} className={`p-1.5 rounded cursor-pointer ${activeFormats.insertUnorderedList ? 'bg-gray-200 text-black shadow-inner' : 'hover:text-black hover:bg-gray-200'}`}><List size={14} /></button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onKeyUp={checkFormats}
          onMouseUp={checkFormats}
          placeholder={placeholder}
          className="w-full min-h-[120px] max-h-[300px] overflow-y-auto text-sm px-4 py-3 outline-none focus:ring-0 prose prose-sm max-w-none empty:before:content-[attr(placeholder)] empty:before:text-gray-400"
        />
      </div>
    </div>
  );
};

export default function ProductsClientWrapper({ initialProducts, categories }) {
  const [products, setProducts] = useState(initialProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPending, startTransition] = useTransition();

  const [images, setImages] = useState({ main: null, gallery: [] });

  const [formData, setFormData] = useState({
    title: "", shortDesc: "", displayNote: "", 
    description: "", materialCare: "", shippingPolicy: "", returnPolicy: "",
    gender: "Women", style: [],
    price: "", salePrice: "",
    purchaseType: "Single Set",
    faqs: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
    metaTitle: "", metaDesc: "", permalink: "",
    canonicalTag: "", schemaCode: "",
    components: [],
    variants: []
  });

  const handleAddProduct = () => {
    setModalMode('add');
    setSelectedProduct(null);
    setImages({ main: null, gallery: [] });
    setFormData({
      title: "", shortDesc: "", displayNote: "", 
      description: "", materialCare: "", shippingPolicy: "", returnPolicy: "",
      gender: "Women", style: [],
      price: "", salePrice: "",
      purchaseType: "Single Set",
      faqs: [
        { question: "", answer: "" }, { question: "", answer: "" },
        { question: "", answer: "" }, { question: "", answer: "" }, { question: "", answer: "" }
      ],
      metaTitle: "", metaDesc: "", permalink: "",
      canonicalTag: "", schemaCode: "",
      components: [],
      variants: [{ id: Date.now(), size: "", price: "", salePrice: "" }]
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    const raw = product.rawProduct;
    setSelectedProduct(raw);
    setModalMode('edit');
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

  const toggleStyle = (item) => {
    setFormData(prev => ({
      ...prev,
      style: prev.style.includes(item) ? prev.style.filter(i => i !== item) : [...prev.style, item]
    }));
  };

  const handleMainImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImages(prev => ({ ...prev, main: { file: e.target.files[0], preview: URL.createObjectURL(e.target.files[0]) } }));
    }
  };

  const handleGalleryImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
      setImages(prev => ({ ...prev, gallery: [...prev.gallery, ...newImages] }));
    }
  };

  const removeGalleryImage = (index) => {
    setImages(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));
  };

  const addComponent = () => {
    setFormData(prev => ({
      ...prev,
      components: [...prev.components, { id: Date.now(), name: "", price: "", salePrice: "", variants: [{ id: Date.now(), size: "" }] }]
    }));
  };

  const removeComponent = (id) => {
    setFormData(prev => ({ ...prev, components: prev.components.filter(c => c.id !== id) }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { id: Date.now(), size: "", price: "", salePrice: "" }]
    }));
  };

  const removeVariant = (id) => {
    setFormData(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) }));
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...formData.faqs];
    updatedFaqs[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: updatedFaqs }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('shortDesc', formData.shortDesc);
    submitData.append('displayNote', formData.displayNote);
    submitData.append('fullDesc', formData.description);
    submitData.append('materialCare', formData.materialCare);
    submitData.append('shippingPolicy', formData.shippingPolicy);
    submitData.append('returnPolicy', formData.returnPolicy);
    submitData.append('gender', formData.gender);
    submitData.append('style', JSON.stringify(formData.style));
    submitData.append('purchaseType', formData.purchaseType);
    submitData.append('status', formData.status);
    submitData.append('basePrice', formData.price);
    submitData.append('faqs', JSON.stringify(formData.faqs));
    submitData.append('seoTitle', formData.metaTitle);
    submitData.append('seoSlug', formData.permalink);
    submitData.append('metaDesc', formData.metaDesc);
    submitData.append('canonicalTag', formData.canonicalTag);
    submitData.append('schemaCode', formData.schemaCode);

    submitData.append('variants', JSON.stringify(formData.variants));

    if (formData.purchaseType !== 'Single Set') {
      submitData.append('components', JSON.stringify(formData.components));
    }

    if (images.main && images.main.file) {
      submitData.append('main_image', images.main.file);
    }

    images.gallery.forEach((img, idx) => {
      if (img.file) {
        submitData.append(`gallery_image_${idx}`, img.file);
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

    return {
      rawProduct: product,
      id: product.id,
      name: product.title,
      sku: mainVariant?.sku || 'N/A',
      category: product.categories?.name || 'Uncategorized',
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
            <p className="text-[13px] text-gray-500 mt-0.5">Manage your store's inventory and product catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleAddProduct} className="px-4 py-2 bg-[#5a4bda] text-white rounded-lg text-[13px] font-bold hover:bg-[#4b3ec2] shadow-sm transition-colors flex items-center gap-2 cursor-pointer">
            <Plus size={16} /> Add New Product
          </button>
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
                        <p onClick={() => handleEditProduct(product)} className="font-bold text-[13px] text-gray-900 mb-0.5 group-hover:text-[#5a4bda] cursor-pointer transition-colors">{product.name}</p>
                        <p className="text-[11px] text-gray-500">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-[13px] font-bold text-gray-900 mb-0.5">₹{product.price.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className={`text-[11px] font-bold ${product.stockStatus === 'In Stock' ? 'text-green-600' : 'text-red-500'
                      }`}>
                      {product.stockStatus}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-bold rounded-full border ${product.status === 'Published' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button onClick={() => handleEditProduct(product)} className="text-gray-400 hover:text-[#5a4bda] cursor-pointer"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-400 hover:text-red-600 cursor-pointer"><Trash2 size={16} /></button>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-[#f4f5f7] overflow-y-auto flex flex-col font-sans pb-20">

          <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="px-8 lg:px-12 py-5 flex items-center justify-between max-w-[1800px] mx-auto w-full">
              <div className="flex items-center gap-4">
                <button onClick={handleCloseModal} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                  <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{modalMode === 'add' ? 'Add New Product' : 'Edit Product'}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={(e) => { setFormData({...formData, status: 'Draft'}); handleSubmit(e); }} className="px-5 py-2.5 text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors cursor-pointer shadow-sm">
                  Save as Draft
                </button>
                <button onClick={(e) => { setFormData({...formData, status: 'Published'}); handleSubmit(e); }} className="px-5 py-2.5 text-[13px] font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm cursor-pointer flex items-center gap-2">
                  {isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                  Publish Product
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 lg:px-12 pt-8 max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

            <div className="lg:col-span-2 space-y-8">

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">Basic Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Product Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Short Description</label>
                    <input type="text" value={formData.shortDesc} onChange={e => setFormData({ ...formData, shortDesc: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Display Note</label>
                    <input type="text" value={formData.displayNote} onChange={e => setFormData({ ...formData, displayNote: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">Detail Information</h2>
                
                <RichTextEditor 
                  label="Description" 
                  placeholder="Write product description..." 
                  value={formData.description} 
                  onChange={(val) => setFormData({...formData, description: val})} 
                />
                
                <RichTextEditor 
                  label="Material & Care" 
                  placeholder="Enter material details..." 
                  value={formData.materialCare} 
                  onChange={(val) => setFormData({...formData, materialCare: val})} 
                />
                
                <RichTextEditor 
                  label="Shipping Policy" 
                  placeholder="Enter shipping rules..." 
                  value={formData.shippingPolicy} 
                  onChange={(val) => setFormData({...formData, shippingPolicy: val})} 
                />
                
                <RichTextEditor 
                  label="Return / Exchange Policy" 
                  placeholder="Enter return rules..." 
                  value={formData.returnPolicy} 
                  onChange={(val) => setFormData({...formData, returnPolicy: val})} 
                />

              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">Product Set</h2>
                <div className="mb-6">
                  <label className="block text-[13px] font-bold text-gray-800 mb-3">Choose Type</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="radio" value="Single Set" checked={formData.purchaseType === 'Single Set'} onChange={e => setFormData({ ...formData, purchaseType: e.target.value })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      Single Set
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                      <input type="radio" value="Multiple Set" checked={formData.purchaseType === 'Multiple Set'} onChange={e => setFormData({ ...formData, purchaseType: e.target.value })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                      Multiple Set
                    </label>
                  </div>
                </div>

                {formData.purchaseType === 'Single Set' ? (
                  <div className="space-y-3">
                    <button type="button" onClick={addVariant} className="text-sm font-bold text-blue-600 flex items-center gap-1 cursor-pointer hover:underline mb-4">
                      + Add Size Variant
                    </button>
                    {formData.variants.map((v, i) => (
                      <div key={v.id} className="flex gap-3 items-center">
                        <input type="text" placeholder="Size (e.g. XL)" className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 outline-none" />
                        <button type="button" onClick={() => removeVariant(v.id)} className="text-red-500 hover:bg-red-50 p-2 rounded cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button type="button" onClick={addComponent} className="text-sm font-bold text-blue-600 flex items-center gap-1 cursor-pointer hover:underline mb-4">
                      + Add Component
                    </button>
                    {formData.components.map((comp, idx) => (
                      <div key={comp.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span className="font-bold text-gray-500">{idx + 1}.</span>
                        <input type="text" placeholder="Name" className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 outline-none min-w-[120px]" />
                        <input type="text" placeholder="Price" className="w-24 text-sm border border-gray-300 rounded-md px-3 py-2 outline-none" />
                        <input type="text" placeholder="Sale Price" className="w-24 text-sm border border-gray-300 rounded-md px-3 py-2 outline-none" />
                        <button type="button" className="text-xs font-bold text-blue-600 cursor-pointer hover:underline whitespace-nowrap">+ Add Size Variant</button>
                        <button type="button" onClick={() => removeComponent(comp.id)} className="text-red-500 hover:bg-red-50 p-2 rounded cursor-pointer"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">FAQs</h2>
                <div className="space-y-6">
                  {formData.faqs.map((faq, idx) => (
                    <div key={idx} className="space-y-3">
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Question {idx + 1}</label>
                      <input type="text" value={faq.question} onChange={e => handleFaqChange(idx, 'question', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-all" />
                      <label className="block text-[12px] font-bold text-gray-500 uppercase tracking-wider">Answer</label>
                      <input type="text" value={faq.answer} onChange={e => handleFaqChange(idx, 'answer', e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 transition-all" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">SEO</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Meta Title</label>
                    <input type="text" value={formData.metaTitle} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Meta Description</label>
                    <input type="text" value={formData.metaDesc} onChange={e => setFormData({ ...formData, metaDesc: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Permalink</label>
                    <input type="text" value={formData.permalink} onChange={e => setFormData({ ...formData, permalink: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-4">Canonical Tag</h2>
                <input type="text" value={formData.canonicalTag} onChange={e => setFormData({ ...formData, canonicalTag: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500" />
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-4">Schema</h2>
                <label className="block text-[12px] font-bold text-gray-500 mb-2">Code / File</label>
                <div className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center gap-4">
                  <button type="button" className="px-5 py-2 text-xs font-bold bg-blue-100 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors cursor-pointer">Paste Code</button>
                  <button type="button" className="px-5 py-2 text-xs font-bold bg-gray-100 text-gray-700 rounded-full border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer">Upload TXT File</button>
                </div>
              </div>

            </div>

            <div className="space-y-8">

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-5 border-b border-gray-100 pb-3">Product Images</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-bold text-gray-600 mb-2 text-center">Main Image</label>
                    <label className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                      {images.main ? (
                        <>
                          <img src={images.main.preview} alt="Main" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white text-xs font-bold">Change Image</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Plus size={24} className="text-gray-400 mb-1" />
                          <span className="text-[11px] font-semibold text-gray-500">Upload</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={handleMainImageUpload} />
                    </label>
                    <input type="text" placeholder="Alt Text" className="w-full mt-2 text-xs border border-gray-300 rounded-md px-2 py-1.5 outline-none text-center" />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-600 mb-2 text-center">Gallery Images</label>
                    <label className="aspect-[3/4] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Plus size={24} className="text-gray-400 mb-1" />
                      <span className="text-[11px] font-semibold text-gray-500">Upload</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryImageUpload} />
                    </label>
                    <input type="text" placeholder="Alt Text" className="w-full mt-2 text-xs border border-gray-300 rounded-md px-2 py-1.5 outline-none text-center" />
                  </div>
                </div>

                {images.gallery.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {images.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-gray-100 rounded-md relative border border-gray-200 group overflow-hidden">
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-white p-0.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-4 border-b border-gray-100 pb-3">Price</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Price</label>
                    <input type="text" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-800 mb-1.5">Sale Price</label>
                    <input type="text" value={formData.salePrice} onChange={e => setFormData({ ...formData, salePrice: e.target.value })} className="w-full text-sm border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-4 border-b border-gray-100 pb-3">Gender</h2>
                <label className="block text-[12px] font-bold text-gray-500 mb-3 uppercase">Category</label>
                <div className="space-y-3">
                  {['Women', 'Men'].map(gender => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="gender" value={gender} checked={formData.gender === gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="w-4 h-4 text-blue-600 cursor-pointer" />
                      <span className="text-sm font-semibold text-gray-800">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-base font-extrabold text-gray-900 mb-4 border-b border-gray-100 pb-3">Style</h2>
                <label className="block text-[12px] font-bold text-gray-500 mb-3 uppercase">Choose Multiple</label>
                <div className="space-y-3">
                  {['Ethnic', 'Western', 'New Arrival', 'Wedding'].map(style => (
                    <label key={style} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.style.includes(style)} onChange={() => toggleStyle(style)} className="w-4 h-4 text-blue-600 rounded cursor-pointer" />
                      <span className="text-sm font-semibold text-gray-800">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}