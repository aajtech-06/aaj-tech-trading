'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Image as ImageIcon,
  Check,
  Type,
  FileText,
  List as ListIcon,
  LayoutGrid,
} from 'lucide-react';

const API_BASE = 'https://aajtechtrading.in/api';

interface HarnessProduct {
  id: string;
  title: string;
  details: string;
  image: string;
  voltageType?: string;
  subcategory?: string;
  spacing?: string;
  bottomPlateType?: string;
  pinQuantity?: string;
  productStatus?: string;
  galleryImages?: string[];
}

export default function HarnessManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<HarnessProduct | null>(null);
  const [products, setProducts] = useState<HarnessProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string, voltageType: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const ITEMS_PER_PAGE = viewMode === 'grid' ? 8 : 10;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    details: '',
    image: '',
    voltageType: '',
    subcategory: '',
    spacing: '',
    bottomPlateType: '',
    pinQuantity: '',
    productStatus: '',
    galleryImages: [] as string[],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/harness/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch harness products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/harness/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const uploadMainFile = async (file: File) => {
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: formDataUpload
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, image: data.url }));
      }
    } catch (error) {
      console.error('Error uploading main image:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryFile = async (file: File) => {
    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: formDataUpload
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), data.url]
        }));
      }
    } catch (error) {
      console.error('Error uploading gallery image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropMain = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      await uploadMainFile(file);
    }
  };

  const handleDropGallery = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await uploadGalleryFile(file);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadMainFile(file);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      await uploadGalleryFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setSubmitting(true);
    try {
      const url = editingProduct
        ? `${API_BASE}/harness/${editingProduct.id}`
        : `${API_BASE}/harness/`;

      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchData();
        setIsAddModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save harness product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      details: '',
      image: '',
      voltageType: '',
      subcategory: '',
      spacing: '',
      bottomPlateType: '',
      pinQuantity: '',
      productStatus: '',
      galleryImages: [],
    });
    setEditingProduct(null);
  };

  const openEditModal = (product: HarnessProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      details: product.details || '',
      image: product.image || '',
      voltageType: product.voltageType || '',
      subcategory: product.subcategory || '',
      spacing: product.spacing || '',
      bottomPlateType: product.bottomPlateType || '',
      pinQuantity: product.pinQuantity || '',
      productStatus: product.productStatus || '',
      galleryImages: product.galleryImages || [],
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this harness product?')) return;
    try {
      const res = await fetch(`${API_BASE}/harness/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleExport = () => {
    if (filteredProducts.length === 0) return;
    const headers = ['Model / Title', 'Spacing', 'Bottom Plate Type', 'Pin Quantity', 'Status', 'Description'];
    const rows = filteredProducts.map(p => [
      `"${p.title}"`,
      `"${p.spacing || ''}"`,
      `"${p.bottomPlateType || ''}"`,
      `"${p.pinQuantity || ''}"`,
      `"${p.productStatus || ''}"`,
      `"${p.details || ''}"`
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "harness_products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.details && p.details.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) {
      return `https://aajtechtrading.in${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-2 tracking-tight uppercase">
            Harness Products
          </h1>
          <p className="text-gray-400 dark:text-neutral-500 font-bold">
            Manage your wire harness industrial catalog items.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={22} />
          Add Harness Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-brand-dark p-5 rounded-[32px] border border-gray-150 dark:border-neutral-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search harness products by model or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-neutral-900 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 bg-gray-50 dark:bg-neutral-900 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl text-gray-400 font-black text-sm uppercase tracking-widest transition-all h-[52px] cursor-pointer"
          >
            <Download size={18} />
            Export
          </button>
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-900 p-1 rounded-xl h-[52px]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white dark:bg-neutral-800 shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'
              }`}
              title="Table View"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'
              }`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-[40px] border border-gray-150 dark:border-neutral-800 shadow-sm">
          <Search size={48} className="mx-auto text-gray-300 dark:text-neutral-700 mb-6" />
          <h3 className="text-xl font-black text-brand-dark dark:text-white mb-2">No matching products</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your search criteria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-gray-150 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-neutral-950/20 border-b border-gray-100 dark:border-neutral-800">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Model</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Spacing</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Bottom Plate Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Pin Quantity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-neutral-850">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-neutral-850/30 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-950 rounded-2xl overflow-hidden shrink-0 border border-gray-150 dark:border-neutral-800 p-2 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getImageUrl(product.image)} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div>
                          <p className="font-black text-brand-dark dark:text-white group-hover:text-brand-red transition-colors text-base uppercase tracking-wide">{product.title}</p>
                          <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">{product.subcategory || 'General'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-sm font-bold text-gray-500 dark:text-neutral-400">
                      {product.spacing || '-'}
                    </td>
                    <td className="px-8 py-8 text-sm font-bold text-gray-500 dark:text-neutral-400">
                      {product.bottomPlateType || '-'}
                    </td>
                    <td className="px-8 py-8 text-sm font-bold text-gray-500 dark:text-neutral-400">
                      {product.pinQuantity || '-'}
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-[10px] font-black bg-brand-red/5 text-brand-red dark:bg-brand-red/10 border border-brand-red/10 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                        {product.productStatus || 'Normal production'}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEditModal(product)}
                          className="w-10 h-10 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 text-gray-300 dark:text-neutral-600 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-blue-100 cursor-pointer"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-10 h-10 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-brand-red text-gray-300 dark:text-neutral-600 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-red-100 cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {currentProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-neutral-900 p-6 rounded-[40px] border border-gray-150 dark:border-neutral-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all flex flex-col"
            >
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 bg-white/90 dark:bg-neutral-800/90 hover:bg-blue-50 text-blue-600 rounded-xl backdrop-blur-sm shadow-sm transition-colors cursor-pointer"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white/90 dark:bg-neutral-800/90 hover:bg-red-50 text-brand-red rounded-xl backdrop-blur-sm shadow-sm transition-colors cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 relative bg-gray-50 dark:bg-neutral-950 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(product.image)}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-black text-brand-dark dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-brand-red transition-colors uppercase tracking-wide">
                  {product.title}
                </h3>
                <p className="text-gray-400 text-xs font-semibold line-clamp-2 mb-4">
                  {product.details || 'No description available'}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-brand-red">
                    {product.productStatus || 'Normal production'}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400">
                    {product.spacing || '-'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 rounded-xl text-sm font-black text-gray-400 hover:text-brand-red transition-all border border-gray-150 dark:border-neutral-800 shadow-sm disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft size={18} /> PREV
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  currentPage === i + 1
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                    : 'bg-white hover:bg-gray-50 dark:bg-neutral-900 text-gray-400 border border-gray-200 dark:border-neutral-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-900 rounded-xl text-sm font-black text-gray-400 hover:text-brand-red transition-all border border-gray-150 dark:border-neutral-800 shadow-sm disabled:opacity-30 cursor-pointer"
          >
            NEXT <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white dark:bg-neutral-900 rounded-[40px] w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800"
            >
              <div className="bg-brand-dark p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-black">{editingProduct ? 'Edit Harness' : 'Add Harness'}</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">
                {/* SECTION 1: Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em] border-b border-gray-100 dark:border-neutral-800 pb-2">
                    Section 1: Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-brand-red" /> Product Model *
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. 2.54FC ribbon cable"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Check size={14} className="text-brand-red" /> Voltage Type *
                      </label>
                      <select
                        required
                        value={formData.voltageType}
                        onChange={e => {
                          const val = e.target.value;
                          setFormData(prev => ({ ...prev, voltageType: val, subcategory: '' }));
                        }}
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select Voltage Type</option>
                        <option value="Low Voltage Harness">Low Voltage Harness</option>
                        <option value="High Voltage Harness">High Voltage Harness</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Check size={14} className="text-brand-red" /> Harness Category *
                      </label>
                      <select
                        required
                        value={formData.subcategory}
                        onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none disabled:opacity-50 cursor-pointer"
                        disabled={!formData.voltageType}
                      >
                        <option value="">Select Category</option>
                        {categories
                          .filter(cat => cat.voltageType === formData.voltageType)
                          .map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Product Specifications */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em] border-b border-gray-100 dark:border-neutral-800 pb-2">
                    Section 2: Product Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-brand-red" /> Spacing
                      </label>
                      <input
                        type="text"
                        value={formData.spacing}
                        onChange={e => setFormData({ ...formData, spacing: e.target.value })}
                        placeholder="e.g. 2.54 spacing"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-brand-red" /> Bottom Plate Type
                      </label>
                      <input
                        type="text"
                        value={formData.bottomPlateType}
                        onChange={e => setFormData({ ...formData, bottomPlateType: e.target.value })}
                        placeholder="e.g. straight insertion"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-brand-red" /> Pin Quantity
                      </label>
                      <input
                        type="text"
                        value={formData.pinQuantity}
                        onChange={e => setFormData({ ...formData, pinQuantity: e.target.value })}
                        placeholder="e.g. 6-pin to 64-pin"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} className="text-brand-red" /> Product Status
                      </label>
                      <input
                        type="text"
                        value={formData.productStatus}
                        onChange={e => setFormData({ ...formData, productStatus: e.target.value })}
                        placeholder="e.g. Normal production"
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={14} className="text-brand-red" /> Product Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.details}
                        onChange={e => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Describe the product details..."
                        className="w-full bg-gray-50 dark:bg-neutral-800 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Product Images */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-xs font-black text-brand-red uppercase tracking-[0.2em] border-b border-gray-100 dark:border-neutral-800 pb-2">
                    Section 3: Product Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Image */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} className="text-brand-red" /> Main Image *
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDropMain}
                        className="w-full h-48 bg-gray-50 dark:bg-neutral-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-neutral-700 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:border-brand-red transition-all"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {formData.image ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={getImageUrl(formData.image)} alt="Main Preview" className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal" />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({ ...prev, image: '' }));
                              }}
                              className="absolute top-3 right-3 p-2 bg-brand-red text-white rounded-xl shadow-md hover:bg-brand-dark transition-colors cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon size={32} className="mx-auto text-gray-300 mb-2 animate-pulse" />
                            <p className="text-xs font-bold text-gray-500">Drag & drop main image here or click to select</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">JPG, PNG or WebP. Max 5MB.</p>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>

                    {/* Gallery Images */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} className="text-brand-red" /> Gallery Images
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDropGallery}
                        className="w-full h-48 bg-gray-50 dark:bg-neutral-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-neutral-700 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer hover:border-brand-red transition-all"
                        onClick={() => galleryInputRef.current?.click()}
                      >
                        <div className="text-center p-4">
                          <Plus size={32} className="mx-auto text-gray-300 mb-2 animate-pulse" />
                          <p className="text-xs font-bold text-gray-500">Drag & drop more gallery images or click to select</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Select multiple images.</p>
                        </div>
                        {uploading && (
                          <div className="absolute inset-0 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        multiple
                        ref={galleryInputRef}
                        onChange={handleGalleryUpload}
                        className="hidden"
                        accept="image/*"
                      />
                    </div>
                  </div>

                  {/* Gallery Previews list */}
                  {formData.galleryImages && formData.galleryImages.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 pt-4 border-t border-gray-50 dark:border-neutral-800/80">
                      {formData.galleryImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 p-2 flex items-center justify-center group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getImageUrl(img)} alt={`Gallery Preview ${idx}`} className="max-w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                galleryImages: prev.galleryImages.filter((_, i) => i !== idx)
                              }));
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-brand-red text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-neutral-800 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-8 py-4 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-750 text-brand-dark dark:text-white rounded-2xl font-black uppercase tracking-wider text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-4 bg-brand-red hover:bg-brand-dark text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-brand-red/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      editingProduct ? 'Save Changes' : 'Create Product'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
