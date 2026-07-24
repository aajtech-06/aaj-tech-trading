'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Trash2,
  X,
  Loader2,
  Edit2,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const API_BASE = 'https://aajtechtrading.in/api';

interface TestingEquipment {
  id: string;
  name: string;
  image: string;
  section?: string;
}

export default function AboutHarnessSettingsPage() {
  const [equipments, setEquipments] = useState<TestingEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestingEquipment | null>(null);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [section, setSection] = useState('Testing Equipment');
  
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/harness/testing-equipment`);
      if (res.ok) {
        const data = await res.json();
        setEquipments(data);
      }
    } catch (err) {
      console.error('Failed to fetch testing equipment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setImageUrl('');
    setSection('Testing Equipment');
    setStatus('idle');
    setMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestingEquipment) => {
    setEditingItem(item);
    setName(item.name);
    setImageUrl(item.image);
    setSection(item.section || 'Testing Equipment');
    setStatus('idle');
    setMessage('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatus('idle');
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setImageUrl(data.url);
        setStatus('success');
        setMessage('Image uploaded successfully.');
      } else {
        setStatus('error');
        setMessage('Failed to upload image.');
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setStatus('error');
      setMessage('Network error during upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploading(true);
      setStatus('idle');
      setMessage('');
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(`${API_BASE}/upload/image`, {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          setImageUrl(data.url);
          setStatus('success');
          setMessage('Image uploaded successfully.');
        } else {
          setStatus('error');
          setMessage('Failed to upload image.');
        }
      } catch (err) {
        console.error('Error uploading image:', err);
        setStatus('error');
        setMessage('Network error during upload.');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatus('error');
      setMessage('Please enter equipment name.');
      return;
    }
    if (!imageUrl.trim()) {
      setStatus('error');
      setMessage('Please upload an image.');
      return;
    }

    setSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const url = editingItem
        ? `${API_BASE}/harness/testing-equipment/${editingItem.id}`
        : `${API_BASE}/harness/testing-equipment`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          image: imageUrl,
          section: section
        }),
      });

      if (res.ok) {
        await fetchEquipments();
        setIsModalOpen(false);
        setEditingItem(null);
        setName('');
        setImageUrl('');
        setSection('Testing Equipment');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.detail || 'Failed to save testing equipment.');
      }
    } catch (err) {
      console.error('Failed to save testing equipment:', err);
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testing equipment?')) return;

    try {
      const res = await fetch(`${API_BASE}/harness/testing-equipment/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setEquipments(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Failed to delete testing equipment.');
      }
    } catch (err) {
      console.error('Error deleting testing equipment:', err);
      alert('Network error.');
    }
  };

  const filteredEquipments = equipments.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-dark mb-2">Harness Equipment Settings</h1>
          <p className="text-gray-400 font-bold">Manage testing, connector, and wire cutting equipment shown on the About Wire Harness page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-red hover:bg-brand-red-hover text-white font-black px-8 py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-brand-red/20 transition-all active:scale-95 shrink-0"
        >
          <Plus size={20} />
          Add Harness Equipment
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search testing equipment by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-brand-red" size={48} />
        </div>
      ) : filteredEquipments.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-24 text-center">
          <ImageIcon className="mx-auto mb-6 text-gray-300" size={48} />
          <h3 className="text-2xl font-black text-brand-dark mb-2">No Equipment Found</h3>
          <p className="text-gray-400 font-bold max-w-sm mx-auto mb-8">
            {searchTerm ? 'No items match your search term.' : 'Get started by adding testing equipment items to display on the harness page.'}
          </p>
          {!searchTerm && (
            <button
              onClick={openAddModal}
              className="bg-brand-red hover:bg-brand-red-hover text-white font-black px-8 py-4 rounded-2xl shadow-lg transition-all"
            >
              Add Your First Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredEquipments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-all duration-300"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden border-b border-gray-100">
                <Image
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Section Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 text-white backdrop-blur-md shadow-md ${
                    item.section === 'Fully automated connector equipment' ? 'bg-orange-500/80' : 
                    item.section === 'Fully automated wire cutting equipment' ? 'bg-blue-500/80' : 'bg-brand-red/80'
                  }`}>
                    {item.section || 'Testing Equipment'}
                  </span>
                </div>
              </div>

              {/* Title & Actions */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <h3 className="font-extrabold text-brand-dark text-lg line-clamp-2">{item.name}</h3>
                
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="flex-1 bg-gray-50 hover:bg-brand-red hover:text-white text-gray-500 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm border border-gray-100"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-3 bg-red-50 hover:bg-brand-red hover:text-white text-red-500 rounded-xl transition-all"
                    title="Delete Equipment"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-brand-dark/50 backdrop-blur-sm z-50 cursor-default"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-[40px] shadow-[0_30px_70px_rgba(0,0,0,0.15)] z-50 overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-brand-dark">
                    {editingItem ? 'Edit Testing Equipment' : 'Add Testing Equipment'}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 mt-1">
                    {editingItem ? 'Update details of the selected equipment.' : 'Introduce new testing equipment to the list.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-brand-dark transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Equipment Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    Equipment Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tensile testing machine"
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                    required
                  />
                </div>

                {/* Equipment Section Select */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    Equipment Section
                  </label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all cursor-pointer"
                    required
                  >
                    <option value="Testing Equipment">Testing Equipment</option>
                    <option value="Fully automated connector equipment">Fully automated connector equipment</option>
                    <option value="Fully automated wire cutting equipment">Fully automated wire cutting equipment</option>
                  </select>
                </div>

                {/* Equipment Image Drag/Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                    Equipment Image
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-4 border-dashed rounded-[32px] p-8 text-center transition-all ${
                      imageUrl ? 'border-green-100 bg-green-50/30' : 'border-gray-100 hover:border-brand-red/20 hover:bg-brand-red/[0.01]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    {imageUrl ? (
                      <div className="space-y-4">
                        <div className="relative aspect-video w-full max-w-sm mx-auto rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
                          <Image src={imageUrl} alt="Preview" fill className="object-contain" />
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white hover:bg-gray-50 text-brand-dark font-black px-4 py-2 border border-gray-200 rounded-xl text-xs transition-all shadow-sm"
                          >
                            Replace Image
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageUrl('')}
                            className="bg-red-50 hover:bg-red-100 text-red-500 font-black px-4 py-2 rounded-xl text-xs transition-all"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="cursor-pointer py-6"
                      >
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-light text-brand-red flex items-center justify-center mb-4">
                          {uploading ? (
                            <Loader2 size={24} className="animate-spin" />
                          ) : (
                            <Upload size={24} />
                          )}
                        </div>
                        <p className="text-lg font-black text-brand-dark">
                          {uploading ? 'Uploading image...' : 'Click to upload or drag image'}
                        </p>
                        <p className="text-xs font-bold text-gray-400 mt-1">
                          PNG, JPG, JPEG are supported
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                {status === 'success' && message && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 font-bold text-sm">
                    <CheckCircle size={18} className="shrink-0" /> {message}
                  </div>
                )}
                {status === 'error' && message && (
                  <div className="p-4 bg-red-50 text-brand-red rounded-2xl flex items-center gap-3 font-bold text-sm">
                    <AlertCircle size={18} className="shrink-0" /> {message}
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploading}
                    className="bg-brand-red hover:bg-brand-red-hover text-white font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-brand-red/10 transition-all active:scale-95 text-sm disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>Save Changes</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
