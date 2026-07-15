'use client';

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

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface EVProduct {
  id: string;
  title: string;
  applications: string;
  details: string;
  variants: string[];
  image: string;
}

export default function EVManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<EVProduct | null>(null);
  const [products, setProducts] = useState<EVProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const ITEMS_PER_PAGE = viewMode === 'grid' ? 8 : 10;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    applications: '',
    details: '',
    variants: '',
    image: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/ev/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch EV products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    setSubmitting(true);
    try {
      const url = editingProduct
        ? `${API_BASE}/ev/${editingProduct.id}`
        : `${API_BASE}/ev/`;

      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          variants: formData.variants.split('\n').filter(v => v.trim() !== '')
        })
      });

      if (res.ok) {
        await fetchData();
        setIsAddModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save EV product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      applications: '',
      details: '',
      variants: '',
      image: '',
    });
    setEditingProduct(null);
  };

  const openEditModal = (product: EVProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      applications: product.applications,
      details: product.details,
      variants: product.variants.join('\n'),
      image: product.image,
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this EV product?')) return;
    try {
      const res = await fetch(`${API_BASE}/ev/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleExport = () => {
    if (filteredProducts.length === 0) return;
    const headers = ['Title', 'Applications', 'Details', 'Variants'];
    const rows = filteredProducts.map(p => [
      `"${p.title}"`,
      `"${p.applications}"`,
      `"${p.details}"`,
      `"${p.variants.join(' | ')}"`
    ].join(','));

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ev_products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.applications.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Helper to resolve image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads/')) {
      return `https://aaj-tech-backend.onrender.com${imagePath}`;
    }
    return imagePath; // Local public folder paths
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">EV Products</h1>
          <p className="text-gray-400 font-bold">Manage specialized EV components and assemblies.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95"
        >
          <Plus size={22} />
          Add EV Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search EV products by title or applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 px-6 bg-gray-50 hover:bg-gray-100 rounded-xl text-gray-400 font-black text-sm uppercase tracking-widest transition-all h-[52px]">
            <Download size={18} />
            Export
          </button>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl h-[52px]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-3 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'}`}
              title="Table View"
            >
              <ListIcon size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'}`}
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
        <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Search size={48} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-xl font-black text-brand-dark mb-2">No matching products</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your search criteria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applications</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Variants</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100 p-2 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={getImageUrl(product.image)} alt={product.title} className="max-w-full max-h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div>
                          <p className="font-black text-brand-dark group-hover:text-brand-red transition-colors text-lg">{product.title}</p>
                          <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">EV Solution</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm font-bold text-gray-500 line-clamp-2 max-w-xs">{product.applications}</p>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-xs font-black bg-gray-100 px-3 py-1.5 rounded-xl text-gray-500">
                        {product.variants.length} Variants
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEditModal(product)}
                          className="w-10 h-10 hover:bg-blue-50 hover:text-blue-600 text-gray-300 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-blue-100"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="w-10 h-10 hover:bg-red-50 hover:text-brand-red text-gray-300 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-red-100"
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
              className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all flex flex-col"
            >
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 bg-white/90 hover:bg-blue-50 text-blue-600 rounded-xl backdrop-blur-sm shadow-sm transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 bg-white/90 hover:bg-red-50 text-brand-red rounded-xl backdrop-blur-sm shadow-sm transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 relative bg-gray-50 flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getImageUrl(product.image)}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-black text-brand-dark text-xl mb-2 line-clamp-1 group-hover:text-brand-red transition-colors">{product.title}</h3>
                <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-4">{product.applications}</p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">{product.variants.length} Variants</span>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100" />
                    ))}
                  </div>
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
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-sm font-black text-gray-400 hover:text-brand-red transition-all border border-gray-100 shadow-sm disabled:opacity-30"
          >
            <ChevronLeft size={18} /> PREV
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-white hover:bg-gray-50 text-gray-400 border border-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-sm font-black text-gray-400 hover:text-brand-red transition-all border border-gray-100 shadow-sm disabled:opacity-30"
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
              className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="bg-brand-dark p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-red rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-2xl font-black">{editingProduct ? 'Edit EV Product' : 'Add EV Product'}</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Type size={14} className="text-brand-red" /> Product Title
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. CCS Type 2 Charging Cable Assembly"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Check size={14} className="text-brand-red" /> Applications
                    </label>
                    <input
                      type="text"
                      value={formData.applications}
                      onChange={e => setFormData({ ...formData, applications: e.target.value })}
                      placeholder="EV charging stations, electric two-wheelers..."
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} className="text-brand-red" /> Details
                    </label>
                    <textarea
                      rows={3}
                      value={formData.details}
                      onChange={e => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Describe the product details..."
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Plus size={14} className="text-brand-red" /> Variants (one per line)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.variants}
                      onChange={e => setFormData({ ...formData, variants: e.target.value })}
                      placeholder="e.g. 16A Single Phase&#10;32A Three Phase&#10;5-meter Cable length..."
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} className="text-brand-red" /> Product Image
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="w-32 h-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                        {formData.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                          <ImageIcon size={32} className="text-gray-300" />
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-brand-red animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-gray-50 hover:bg-gray-100 text-brand-dark font-black px-6 py-3 rounded-xl transition-all mb-2 flex items-center gap-2"
                        >
                          <ImageIcon size={18} /> Choose File
                        </button>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">JPG, PNG or WebP. Max 5MB.</p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                          accept="image/*"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-400 font-black py-4 rounded-2xl transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    disabled={submitting || uploading}
                    type="submit"
                    className="flex-[2] bg-brand-red hover:bg-brand-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-red/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : editingProduct ? 'UPDATE EV PRODUCT' : 'ADD EV PRODUCT'}
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
