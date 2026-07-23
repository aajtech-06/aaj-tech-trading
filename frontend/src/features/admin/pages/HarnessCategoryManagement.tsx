'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Layers,
  X,
  Loader2,
  Edit2,
  Search,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://aajtechtrading.in/api';

interface HarnessCategory {
  id: string;
  name: string;
  voltageType: string;
}

export default function HarnessCategoryManagement() {
  const [categories, setCategories] = useState<HarnessCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'low' | 'high'>('low');
  const [searchTerm, setSearchTerm] = useState('');

  // Add category state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatVoltage, setNewCatVoltage] = useState('Low Voltage Harness');

  // Edit category state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<HarnessCategory | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatVoltage, setEditCatVoltage] = useState('Low Voltage Harness');

  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/harness/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch harness categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/harness/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatName.trim(),
          voltageType: newCatVoltage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) => [...prev, data]);
        setNewCatName('');
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Error adding category:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (cat: HarnessCategory) => {
    setEditingCategory(cat);
    setEditCatName(cat.name);
    setEditCatVoltage(cat.voltageType);
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/harness/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editCatName.trim(),
          voltageType: editCatVoltage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? data : c))
        );
        setShowEditModal(false);
        setEditingCategory(null);
      }
    } catch (err) {
      console.error('Error updating category:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will no longer be visible in it.')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/harness/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Error deleting category:', err);
    }
  };

  // Filters logic
  const filteredCategories = categories.filter((cat) => {
    const matchesTab =
      activeTab === 'low'
        ? cat.voltageType === 'Low Voltage Harness'
        : cat.voltageType === 'High Voltage Harness';
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark dark:text-white mb-2 tracking-tight uppercase">
            Harness Categories
          </h1>
          <p className="text-gray-400 dark:text-neutral-500 font-bold">
            Dynamically manage Low Voltage and High Voltage categories.
          </p>
        </div>
        <button
          onClick={() => {
            setNewCatVoltage(activeTab === 'low' ? 'Low Voltage Harness' : 'High Voltage Harness');
            setShowAddModal(true);
          }}
          className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={22} /> Add Category
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-brand-dark p-4 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-sm">
        {/* Toggle tabs */}
        <div className="flex bg-gray-50 dark:bg-neutral-900 p-1.5 rounded-2xl border border-gray-100 dark:border-neutral-800/80 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('low')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'low'
                ? 'bg-brand-red text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-brand-dark dark:hover:text-white'
            }`}
          >
            Low Voltage
          </button>
          <button
            onClick={() => setActiveTab('high')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'high'
                ? 'bg-brand-red text-white shadow-md'
                : 'text-gray-400 dark:text-gray-500 hover:text-brand-dark dark:hover:text-white'
            }`}
          >
            High Voltage
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl py-3 pl-12 pr-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-red" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-600 bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-neutral-800">
          <Layers size={48} className="mb-4 opacity-40" />
          <p className="font-bold text-lg">No categories found</p>
          <p className="text-sm">Create a new category using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md hover:border-brand-red/10 transition-all group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-red/5 dark:bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-black text-brand-dark dark:text-white text-sm uppercase tracking-wide">
                    {cat.name}
                  </h3>
                  <span className="inline-block text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                    {cat.voltageType}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => handleEditClick(cat)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-750 text-brand-dark dark:text-white hover:text-brand-red rounded-xl transition-all cursor-pointer"
                  title="Edit Category"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-brand-red rounded-xl transition-all cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-[36px] w-full max-w-md relative z-10 p-8 shadow-2xl border border-gray-100 dark:border-neutral-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-brand-dark dark:text-white uppercase tracking-wider">
                  Add Harness Category
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="e.g. Railway Harness"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl py-3 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Voltage Type *
                  </label>
                  <select
                    value={newCatVoltage}
                    onChange={(e) => setNewCatVoltage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl py-3 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none"
                  >
                    <option value="Low Voltage Harness">Low Voltage Harness</option>
                    <option value="High Voltage Harness">High Voltage Harness</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-red hover:bg-brand-dark text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg shadow-brand-red/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Create Category'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-neutral-900 rounded-[36px] w-full max-w-md relative z-10 p-8 shadow-2xl border border-gray-100 dark:border-neutral-800"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-brand-dark dark:text-white uppercase tracking-wider">
                  Edit Harness Category
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleUpdateCategory} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCatName}
                    onChange={(e) => setEditCatName(e.target.value)}
                    placeholder="e.g. Railway Harness"
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl py-3 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">
                    Voltage Type *
                  </label>
                  <select
                    value={editCatVoltage}
                    onChange={(e) => setEditCatVoltage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl py-3 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none"
                  >
                    <option value="Low Voltage Harness">Low Voltage Harness</option>
                    <option value="High Voltage Harness">High Voltage Harness</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-brand-red hover:bg-brand-dark text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg shadow-brand-red/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
