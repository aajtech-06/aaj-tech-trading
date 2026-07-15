'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Type,
  FileText,
  LayoutGrid,
  List as ListIcon,
  Tag,
  Check,
  Loader2,
  Image as ImageIcon,
  Zap,
  Thermometer,
  Maximize2,
  Settings
} from 'lucide-react';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category_id: string;
  description: string;
  image: string;
  stock: number;
  status: string;
  features: string[];
  specifications: Record<string, string>;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    category_id: '',
    description: '',
    image: '',
    stock: '',
    status: 'active',
    features: '',
    // Technical Specs
    spec_pins: '',
    spec_pitch: '',
    spec_current: '',
    spec_voltage: '',
    spec_contact_resistance: '',
    spec_insulation_resistance: '',
    spec_temp_range: '',
    spec_mount_type: '',
    spec_gender: '',
    spec_material: '',
    spec_stack_height: '',
    spec_orientation: '',
    spec_wire_size: '',
    spec_rated_current: '',
    spec_rated_voltage: '',
    spec_positions: '',
    spec_type: '', // Screw / Spring
    spec_shrink_ratio: '',
    spec_inner_diameter: '',
    spec_length: '',
    spec_temp_rating: '',
    spec_color: '',
    spec_weight: '',
    spec_size: '',
    spec_custom: '' // For any custom specs as key-value pairs
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_BASE}/products/`),
        fetch(`${API_BASE}/categories/`)
      ]);
      const prodData = await prodRes.json();
      const catData = await catRes.json();
      setProducts(prodData);
      setCategories(catData);
      if (catData.length > 0) {
        setNewProduct(prev => ({ ...prev, category_id: catData[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Max size is 5MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setNewProduct(prev => ({ ...prev, image: data.url }));
      } else {
        console.error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category_id) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          sku: newProduct.sku,
          price: parseFloat(newProduct.price) || 0,
          stock: parseInt(newProduct.stock) || 0,
          status: newProduct.status,
          category_id: newProduct.category_id,
          description: newProduct.description,
          image: newProduct.image,
          features: newProduct.features.split('\n').filter(f => f.trim() !== ''),
          specifications: {
            Pins: newProduct.spec_pins,
            Pitch: newProduct.spec_pitch,
            Current: newProduct.spec_current,
            Voltage: newProduct.spec_voltage,
            "Contact Resistance": newProduct.spec_contact_resistance,
            "Insulation Resistance": newProduct.spec_insulation_resistance,
            "Temperature Range": newProduct.spec_temp_range,
            "Mount Type": newProduct.spec_mount_type,
            Gender: newProduct.spec_gender,
            Material: newProduct.spec_material,
            "Stack Height": newProduct.spec_stack_height,
            Orientation: newProduct.spec_orientation,
            "Wire Size": newProduct.spec_wire_size,
            "Rated Current": newProduct.spec_rated_current,
            "Rated Voltage": newProduct.spec_rated_voltage,
            Positions: newProduct.spec_positions,
            Type: newProduct.spec_type,
            "Shrink Ratio": newProduct.spec_shrink_ratio,
            "Inner Diameter": newProduct.spec_inner_diameter,
            Length: newProduct.spec_length,
            "Temperature Rating": newProduct.spec_temp_rating,
            Color: newProduct.spec_color,
            Weight: newProduct.spec_weight,
            Size: newProduct.spec_size,
            Custom: newProduct.spec_custom
          }
        })
      });
      if (res.ok) {
        const addedProduct = await res.json();
        setProducts(prev => [...prev, addedProduct]);
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          sku: '',
          price: '',
          category_id: categories.length > 0 ? categories[0].id : '',
          description: '',
          image: '',
          stock: '',
          status: 'active',
          features: '',
          spec_pins: '',
          spec_pitch: '',
          spec_current: '',
          spec_voltage: '',
          spec_contact_resistance: '',
          spec_insulation_resistance: '',
          spec_temp_range: '',
          spec_mount_type: '',
          spec_gender: '',
          spec_material: '',
          spec_stack_height: '',
          spec_orientation: '',
          spec_wire_size: '',
          spec_rated_current: '',
          spec_rated_voltage: '',
          spec_positions: '',
          spec_type: '',
          spec_shrink_ratio: '',
          spec_inner_diameter: '',
          spec_length: '',
          spec_temp_rating: '',
          spec_color: '',
          spec_weight: '',
          spec_size: '',
          spec_custom: ''
        });
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category_id || !editingProduct) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          sku: newProduct.sku,
          price: parseFloat(newProduct.price) || 0,
          stock: parseInt(newProduct.stock) || 0,
          status: newProduct.status,
          category_id: newProduct.category_id,
          description: newProduct.description,
          image: newProduct.image,
          features: newProduct.features.split('\n').filter(f => f.trim() !== ''),
          specifications: {
            Pins: newProduct.spec_pins,
            Pitch: newProduct.spec_pitch,
            Current: newProduct.spec_current,
            Voltage: newProduct.spec_voltage,
            "Contact Resistance": newProduct.spec_contact_resistance,
            "Insulation Resistance": newProduct.spec_insulation_resistance,
            "Temperature Range": newProduct.spec_temp_range,
            "Mount Type": newProduct.spec_mount_type,
            Gender: newProduct.spec_gender,
            Material: newProduct.spec_material,
            "Stack Height": newProduct.spec_stack_height,
            Orientation: newProduct.spec_orientation,
            "Wire Size": newProduct.spec_wire_size,
            "Rated Current": newProduct.spec_rated_current,
            "Rated Voltage": newProduct.spec_rated_voltage,
            Positions: newProduct.spec_positions,
            Type: newProduct.spec_type,
            "Shrink Ratio": newProduct.spec_shrink_ratio,
            "Inner Diameter": newProduct.spec_inner_diameter,
            Length: newProduct.spec_length,
            "Temperature Rating": newProduct.spec_temp_rating,
            Color: newProduct.spec_color,
            Weight: newProduct.spec_weight,
            Size: newProduct.spec_size,
            Custom: newProduct.spec_custom
          }
        })
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        setIsAddModalOpen(false);
        setEditingProduct(null);
        setNewProduct({
          name: '',
          sku: '',
          price: '',
          category_id: categories.length > 0 ? categories[0].id : '',
          description: '',
          image: '',
          stock: '',
          status: 'active',
          features: '',
          spec_pins: '',
          spec_pitch: '',
          spec_current: '',
          spec_voltage: '',
          spec_contact_resistance: '',
          spec_insulation_resistance: '',
          spec_temp_range: '',
          spec_mount_type: '',
          spec_gender: '',
          spec_material: '',
          spec_stack_height: '',
          spec_orientation: '',
          spec_wire_size: '',
          spec_rated_current: '',
          spec_rated_voltage: '',
          spec_positions: '',
          spec_type: '',
          spec_shrink_ratio: '',
          spec_inner_diameter: '',
          spec_length: '',
          spec_temp_rating: '',
          spec_color: '',
          spec_weight: '',
          spec_size: '',
          spec_custom: ''
        });
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      sku: product.sku || '',
      price: product.price?.toString() || '',
      category_id: product.category_id,
      description: product.description || '',
      image: product.image || '',
      stock: product.stock?.toString() || '',
      status: product.status || 'active',
      features: product.features?.join('\n') || '',
      spec_pins: product.specifications?.Pins || '',
      spec_pitch: product.specifications?.Pitch || '',
      spec_current: product.specifications?.Current || '',
      spec_voltage: product.specifications?.Voltage || '',
      spec_contact_resistance: product.specifications?.['Contact Resistance'] || '',
      spec_insulation_resistance: product.specifications?.['Insulation Resistance'] || '',
      spec_temp_range: product.specifications?.['Temperature Range'] || '',
      spec_mount_type: product.specifications?.['Mount Type'] || '',
      spec_gender: product.specifications?.Gender || '',
      spec_material: product.specifications?.Material || '',
      spec_stack_height: product.specifications?.['Stack Height'] || '',
      spec_orientation: product.specifications?.Orientation || '',
      spec_wire_size: product.specifications?.['Wire Size'] || '',
      spec_rated_current: product.specifications?.['Rated Current'] || '',
      spec_rated_voltage: product.specifications?.['Rated Voltage'] || '',
      spec_positions: product.specifications?.Positions || '',
      spec_type: product.specifications?.Type || '',
      spec_shrink_ratio: product.specifications?.['Shrink Ratio'] || '',
      spec_inner_diameter: product.specifications?.['Inner Diameter'] || '',
      spec_length: product.specifications?.Length || '',
      spec_temp_rating: product.specifications?.['Temperature Rating'] || '',
      spec_color: product.specifications?.Color || '',
      spec_weight: product.specifications?.Weight || '',
      spec_size: product.specifications?.Size || '',
      spec_custom: product.specifications?.Custom || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));

    const category = categories.find(c => c.id === p.category_id);
    const categoryName = category ? category.name : 'Uncategorized';

    const matchesFilter = filterCategory === 'All' || categoryName === filterCategory;
    return matchesSearch && matchesFilter;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  const uniqueCategories = ['All', ...Array.from(new Set(categories.map(c => c.name)))];

  const handleExport = () => {
    if (filteredProducts.length === 0) return;
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const rows = filteredProducts.map(p => {
      const cat = categories.find(c => c.id === p.category_id);
      return [
        `"${p.name}"`,
        `"${p.sku || ''}"`,
        `"${cat ? cat.name : 'Uncategorized'}"`,
        p.price,
        p.stock,
        p.status
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">Inventory</h1>
          <p className="text-gray-400 font-bold">Manage your product catalog, stock, and global visibility.</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setNewProduct({
              name: '',
              sku: '',
              price: '',
              category_id: categories.length > 0 ? categories[0].id : '',
              description: '',
              image: '',
              stock: '',
              status: 'active',
              features: '',
              spec_pins: '',
              spec_pitch: '',
              spec_current: '',
              spec_voltage: '',
              spec_contact_resistance: '',
              spec_insulation_resistance: '',
              spec_temp_range: '',
              spec_mount_type: '',
              spec_gender: '',
              spec_material: '',
              spec_stack_height: '',
              spec_orientation: '',
              spec_wire_size: '',
              spec_rated_current: '',
              spec_rated_voltage: '',
              spec_positions: '',
              spec_type: '',
              spec_shrink_ratio: '',
              spec_inner_diameter: '',
              spec_length: '',
              spec_temp_rating: '',
              spec_color: '',
              spec_weight: '',
              spec_size: '',
              spec_custom: ''
            });
            setIsAddModalOpen(true);
          }}
          className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95"
        >
          <Plus size={22} />
          Add New Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name, SKU or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="appearance-none bg-gray-50 border-none rounded-xl py-3 pl-12 pr-10 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all cursor-pointer h-[52px]"
            >
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
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

      {/* Product List View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Search size={48} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-xl font-black text-brand-dark mb-2">No matching products</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your search or filter criteria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">SKU</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentProducts.map((product) => {
                  const category = categories.find(c => c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100 p-2 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={product.image || `https://images.unsplash.com/photo-1558467523-46113f1fef72?q=80&w=100&h=100&auto=format&fit=crop`} alt={product.name} className="max-w-full max-h-full object-contain mix-blend-multiply grayscale group-hover:grayscale-0 transition-all duration-500" />
                          </div>
                          <div>
                            <p className="font-black text-brand-dark group-hover:text-brand-red transition-colors text-lg">{product.name}</p>
                            <p className="text-[10px] font-black text-brand-red uppercase tracking-[0.2em]">{category ? category.name : 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <code className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-xl text-xs font-black">{product.sku}</code>
                      </td>
                      <td className="px-8 py-8">
                        <div>
                          <p className="font-black text-brand-dark text-lg">{product.stock}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">units available</p>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full ${product.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' :
                          product.status === 'draft' ? 'bg-gray-50 text-gray-400 border border-gray-100' :
                            'bg-red-50 text-red-600 border-red-100'
                          }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEditModal(product)}
                            className="w-10 h-10 hover:bg-blue-50 hover:text-blue-600 text-gray-300 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-blue-100"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="w-10 h-10 hover:bg-red-50 hover:text-brand-red text-gray-300 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination for Table */}
          <div className="px-8 py-8 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages || 1}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 disabled:opacity-30 transition-all border border-gray-200 hover:bg-gray-50"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let startPage = 1;
                  if (totalPages > 5) {
                    startPage = Math.max(1, currentPage - 2);
                    if (startPage + 4 > totalPages) {
                      startPage = totalPages - 4;
                    }
                  }
                  const pageNum = startPage + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${currentPage === pageNum ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-white hover:bg-gray-50 text-gray-400 border border-gray-200'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 disabled:opacity-30 transition-all border border-gray-200 hover:bg-gray-50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentProducts.map((product, i) => {
              const category = categories.find(c => c.id === product.category_id);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full"
                >
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 bg-white/90 hover:bg-blue-50 text-blue-600 rounded-xl backdrop-blur-sm shadow-sm transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-white/90 hover:bg-red-50 text-brand-red rounded-xl backdrop-blur-sm shadow-sm transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative bg-gray-50 flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image || 'https://images.unsplash.com/photo-1558467523-46113f1fef72?q=80&w=600&h=400&auto=format&fit=crop'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/90 text-brand-red backdrop-blur-md shadow-sm">
                      {category ? category.name : 'Uncategorized'}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <p className="text-xs font-bold text-gray-400 mb-1">{product.sku}</p>
                    <h3 className="font-black text-brand-dark text-xl mb-4 line-clamp-2 leading-tight group-hover:text-brand-red transition-colors">{product.name}</h3>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <div>
                        <p className="font-black text-brand-dark text-lg">{product.stock}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">units available</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${product.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                        product.status === 'draft' ? 'bg-gray-50 text-gray-400 border-gray-100' :
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination for Grid */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-sm font-black text-gray-400 hover:text-brand-red transition-all border border-gray-100 shadow-sm disabled:opacity-30"
            >
              <ChevronLeft size={18} /> PREV
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let startPage = 1;
                if (totalPages > 3) {
                  startPage = Math.max(1, currentPage - 1);
                  if (startPage + 2 > totalPages) {
                    startPage = totalPages - 2;
                  }
                }
                const pageNum = startPage + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-12 h-12 rounded-xl text-sm font-black transition-all ${currentPage === pageNum ? 'bg-brand-red text-white shadow-xl shadow-brand-red/20' : 'bg-white text-gray-400 border border-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-xl text-sm font-black text-gray-400 hover:text-brand-red transition-all border border-gray-100 shadow-sm disabled:opacity-30"
            >
              NEXT <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {/* Advanced Add Product Modal */}
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
              className="bg-white rounded-[40px] w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-brand-dark p-8 md:p-10 text-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center shadow-xl shadow-brand-red/20">
                    <Plus size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic">{editingProduct ? 'Edit Product' : 'Create Product'}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Catalog Expansion System</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <form className="space-y-10" onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Type size={12} className="text-brand-red" /> Product Name
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
                        placeholder="e.g. 9-Pin D-Sub"
                        required
                      />
                    </div>

                    {/* Category Dropdown */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Tag size={12} className="text-brand-red" /> Category Selection
                      </label>
                      <div className="relative">
                        <select
                          value={newProduct.category_id}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, category_id: e.target.value }))}
                          className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none appearance-none cursor-pointer"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                        <LayoutGrid className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* SKU */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SKU Reference</label>
                      <input
                        type="text"
                        value={newProduct.sku}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, sku: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        placeholder="AAJ-CONN-001"
                      />
                    </div>
                    {/* Price */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Price (INR)</label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        placeholder="450"
                      />
                    </div>
                    {/* Stock */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock</label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  {/* Technical Specifications Section */}
                  <div className="space-y-8">
                    {/* Section 1: Electrical & Primary Specs */}
                    <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 space-y-6">
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                        <Zap size={16} className="text-brand-red" /> Electrical & Performance
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current</label>
                          <input type="text" value={newProduct.spec_current} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_current: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 5A" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Voltage</label>
                          <input type="text" value={newProduct.spec_voltage} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_voltage: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 250V" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rated Current</label>
                          <input type="text" value={newProduct.spec_rated_current} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_rated_current: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 10A" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rated Voltage</label>
                          <input type="text" value={newProduct.spec_rated_voltage} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_rated_voltage: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 600V" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Resistance</label>
                          <input type="text" value={newProduct.spec_contact_resistance} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_contact_resistance: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. <20mΩ" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Insulation Resistance</label>
                          <input type="text" value={newProduct.spec_insulation_resistance} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_insulation_resistance: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. >1000MΩ" />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Mechanical & Material */}
                    <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 space-y-6">
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                        <Settings size={16} className="text-brand-red" /> Mechanical & Material
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pins / Contacts</label>
                          <input type="text" value={newProduct.spec_pins} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_pins: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 9" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Positions</label>
                          <input type="text" value={newProduct.spec_positions} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_positions: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 2x5" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                          <select value={newProduct.spec_gender} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_gender: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none">
                            <option value="">Not Applicable</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Universal">Universal</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material</label>
                          <input type="text" value={newProduct.spec_material} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_material: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. PBT/Brass" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mount Type</label>
                          <input type="text" value={newProduct.spec_mount_type} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_mount_type: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. PCB/Panel" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Orientation</label>
                          <input type="text" value={newProduct.spec_orientation} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_orientation: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. Right Angle" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type (Screw/Spring)</label>
                          <input type="text" value={newProduct.spec_type} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_type: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. Screw" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Wire Size</label>
                          <input type="text" value={newProduct.spec_wire_size} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_wire_size: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 22-14 AWG" />
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Dimensions & Physical */}
                    <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 space-y-6">
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                        <Maximize2 size={16} className="text-brand-red" /> Dimensions & Physical
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pitch</label>
                          <input type="text" value={newProduct.spec_pitch} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_pitch: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 2.54mm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Length</label>
                          <input type="text" value={newProduct.spec_length} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_length: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 50mm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inner Diameter</label>
                          <input type="text" value={newProduct.spec_inner_diameter} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_inner_diameter: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 3.2mm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Shrink Ratio</label>
                          <input type="text" value={newProduct.spec_shrink_ratio} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_shrink_ratio: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 2:1" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stack Height</label>
                          <input type="text" value={newProduct.spec_stack_height} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_stack_height: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 5mm" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Size</label>
                          <input type="text" value={newProduct.spec_size} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_size: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. Large" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Color</label>
                          <input type="text" value={newProduct.spec_color} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_color: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. Black" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Weight</label>
                          <input type="text" value={newProduct.spec_weight} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_weight: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 50g" />
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Environmental & Other */}
                    <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 space-y-6">
                      <h3 className="text-sm font-black text-brand-dark uppercase tracking-[0.2em] flex items-center gap-2">
                        <Thermometer size={16} className="text-brand-red" /> Environmental & Additional
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temperature Range</label>
                          <input type="text" value={newProduct.spec_temp_range} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_temp_range: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. -40°C to +105°C" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Temperature Rating</label>
                          <input type="text" value={newProduct.spec_temp_rating} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_temp_rating: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. 125°C" />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Custom Specification (Key-Value)</label>
                          <input type="text" value={newProduct.spec_custom} onChange={(e) => setNewProduct(prev => ({ ...prev, spec_custom: e.target.value }))} className="w-full bg-white border border-gray-100 rounded-xl py-4 px-5 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" placeholder="e.g. RoHS: Compliant; Flammability: UL94V-0" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Check size={12} className="text-brand-red" /> Key Features
                    </label>
                    <textarea
                      rows={3}
                      value={newProduct.features}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, features: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                      placeholder="Enter key features (one per line)..."
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <FileText size={12} className="text-brand-red" /> Technical Overview
                    </label>
                    <textarea
                      rows={4}
                      value={newProduct.description}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none resize-none"
                      placeholder="Provide technical specifications and usage details..."
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <ImageIcon size={12} className="text-brand-red" /> Product Image
                    </label>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Upload Area */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${newProduct.image ? 'border-green-100 bg-green-50/10' : 'border-gray-100 hover:border-brand-red/30 hover:bg-brand-red/5 bg-gray-50/30'
                          }`}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                          accept="image/*"
                        />

                        {uploading ? (
                          <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
                            <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Uploading...</p>
                          </div>
                        ) : (
                          <>
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${newProduct.image ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 group-hover:text-brand-red group-hover:scale-110 shadow-sm'
                              }`}>
                              {newProduct.image ? <Check size={28} /> : <Upload size={28} />}
                            </div>
                            <div className="text-center">
                              <p className="font-black text-brand-dark text-sm mb-1">
                                {newProduct.image ? 'Image Selected' : 'Drop image here or click to upload'}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Preview Area */}
                      {newProduct.image && (
                        <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative group/preview">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={newProduct.image} alt="Preview" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewProduct(prev => ({ ...prev, image: '' }));
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-lg shadow-brand-red/20"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Manual URL Input (Fallback) */}
                    <div className="pt-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2">Or paste image URL</p>
                      <input
                        type="text"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all text-xs"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-6 rounded-[24px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] bg-brand-dark hover:bg-brand-red text-white py-6 rounded-[24px] font-black text-xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <>{editingProduct ? 'Update Product' : 'Deploy to Catalog'} <Check size={24} className="group-hover:scale-125 transition-transform" /></>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
