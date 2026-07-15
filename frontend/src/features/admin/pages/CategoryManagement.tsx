'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Layers,
  X,
  Check,
  Type,
  Loader2,
  GripVertical,
  Upload,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface Category {
  id: string;
  name: string;
  count: number;
  image?: string;
}

const SortableCategory = ({
  cat,
  handleDeleteCategory,
  handleEditCategory
}: {
  cat: Category,
  handleDeleteCategory: (id: string) => void,
  handleEditCategory: (cat: Category) => void
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group flex items-center justify-between ${isDragging ? 'shadow-2xl ring-2 ring-brand-red opacity-80' : ''}`}
    >
      <div className="flex items-center gap-4">
        {/* Drag handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-brand-red transition-colors p-1">
          <GripVertical size={20} />
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-red overflow-hidden border border-gray-100/50">
          {cat.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          ) : (
            <Layers size={20} />
          )}
        </div>
        <div>
          <h3 className="font-black text-brand-dark">{cat.name}</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.count} Items</p>
        </div>
      </div>

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => handleEditCategory(cat)}
          className="p-2 hover:bg-gray-50 text-brand-dark hover:text-brand-red rounded-lg transition-colors"
          title="Edit Category"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => handleDeleteCategory(cat.id)}
          className="p-2 hover:bg-red-50 text-brand-red rounded-lg"
          title="Delete Category"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};

const CategoryManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryImage, setEditCategoryImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/categories/`);
      const data = await res.json();
      setCategories(data);
    } catch {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  // Handle image upload for both add and edit
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, mode: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (res.ok) {
        if (mode === 'add') {
          setNewCategoryImage(data.url);
        } else {
          setEditCategoryImage(data.url);
        }
      } else {
        console.error('Upload failed:', data.detail || 'Unknown error');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          count: 0,
          image: newCategoryImage,
          icon: 'Layers' // default icon
        }),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories((prev) => [...prev, newCat]);
        setNewCategoryName('');
        setNewCategoryImage('');
        setShowAddModal(false);
      }
    } catch {
      console.error('Failed to add category');
    } finally {
      setSubmitting(false);
    }
  };

  // Click handler to open Edit modal
  const handleEditCategoryClick = (cat: Category) => {
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
    setEditCategoryImage(cat.image || '');
    setShowEditModal(true);
  };

  // Update category in backend
  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCategoryName.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editCategoryName.trim(),
          count: editingCategory.count,
          image: editCategoryImage,
          icon: 'Layers'
        }),
      });
      if (res.ok) {
        const updatedCat = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updatedCat : c))
        );
        setShowEditModal(false);
        setEditingCategory(null);
        setEditCategoryName('');
        setEditCategoryImage('');
      }
    } catch {
      console.error('Failed to update category');
    } finally {
      setSubmitting(false);
    }
  };


  // Delete category
  const handleDeleteCategory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      }
    } catch {
      console.error('Failed to delete category');
    }
  };

  // Reorder sync
  const syncOrder = async (items: Category[]) => {
    try {
      await fetch(`${API_BASE}/categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_ids: items.map(i => i.id) }),
      });
    } catch {
      console.error('Failed to sync sequence');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Sync with backend asynchronously
        syncOrder(newItems);

        return newItems;
      });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">Categories</h1>
          <p className="text-gray-400 font-bold">Quickly manage your product category list.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brand-red hover:bg-brand-red/90 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95"
        >
          <Plus size={22} /> Add Category
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-brand-red" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Layers size={48} className="mb-4 opacity-40" />
          <p className="font-bold text-lg">No categories yet</p>
          <p className="text-sm">Click &quot;Add Category&quot; to create your first one.</p>
        </div>
      ) : (
        /* Categories Grid */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map(c => c.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <SortableCategory
                  key={cat.id}
                  cat={cat}
                  handleDeleteCategory={handleDeleteCategory}
                  handleEditCategory={handleEditCategoryClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Simple Add Category Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowAddModal(false); setNewCategoryName(''); setNewCategoryImage(''); }}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-brand-dark">New Category</h2>
                  <button onClick={() => { setShowAddModal(false); setNewCategoryName(''); setNewCategoryImage(''); }} className="text-gray-400"><X size={20} /></button>
                </div>

                <form className="space-y-6" onSubmit={handleAddCategory}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Type size={12} className="text-brand-red" /> Name
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g. PCB Connectors"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                    />
                  </div>

                  {/* Category Image Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Upload size={12} className="text-brand-red" /> Category Image
                    </label>
                    <div className="relative border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'add')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-brand-red" size={24} />
                          <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Uploading...</p>
                        </div>
                      ) : newCategoryImage ? (
                        <div className="flex flex-col items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={newCategoryImage} alt="Category preview" className="w-20 h-20 object-contain rounded-xl" />
                          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Image Uploaded Successfully</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} className="text-gray-400 group-hover:text-brand-red transition-colors" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-red transition-colors">Click to Upload Image</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || uploading || !newCategoryName.trim()}
                    className="w-full bg-brand-red hover:bg-brand-dark text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Adding...</>
                    ) : (
                      <>Add Category <Check size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Category Modal */}
      <AnimatePresence>
        {showEditModal && editingCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowEditModal(false); setEditingCategory(null); setEditCategoryName(''); setEditCategoryImage(''); }}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-brand-dark">Edit Category</h2>
                  <button onClick={() => { setShowEditModal(false); setEditingCategory(null); setEditCategoryName(''); setEditCategoryImage(''); }} className="text-gray-400"><X size={20} /></button>
                </div>

                <form className="space-y-6" onSubmit={handleUpdateCategory}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Type size={12} className="text-brand-red" /> Name
                    </label>
                    <input
                      type="text"
                      autoFocus
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      placeholder="e.g. PCB Connectors"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                    />
                  </div>

                  {/* Category Image Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Upload size={12} className="text-brand-red" /> Category Image
                    </label>
                    <div className="relative border-2 border-dashed border-gray-100 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100/50 transition-colors cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'edit')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="animate-spin text-brand-red" size={24} />
                          <p className="text-[10px] font-black text-brand-red uppercase tracking-widest">Uploading...</p>
                        </div>
                      ) : editCategoryImage ? (
                        <div className="flex flex-col items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={editCategoryImage} alt="Category preview" className="w-20 h-20 object-contain rounded-xl" />
                          <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Image Uploaded Successfully</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} className="text-gray-400 group-hover:text-brand-red transition-colors" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-brand-red transition-colors">Click to Upload Image</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || uploading || !editCategoryName.trim()}
                    className="w-full bg-brand-red hover:bg-brand-dark text-white py-4 rounded-2xl font-black transition-all shadow-lg shadow-brand-red/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Saving...</>
                    ) : (
                      <>Save Changes <Check size={18} /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;
