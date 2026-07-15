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
  Type,
  FileText,
  Image as ImageIcon,
  Check,
  Loader2,
  Layout,
  LayoutGrid,
  Upload
} from 'lucide-react';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
  read_time: string;
}

export default function BlogManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filterCategory, setFilterCategory] = useState('All');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const initialFormState = {
    title: '',
    excerpt: '',
    content: '',
    category: 'Innovation',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    image: '',
    author: 'Admin',
    read_time: '5 min read'
  };

  const [newBlog, setNewBlog] = useState(initialFormState);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/blogs/`);
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Image is too large!\n\nGuidance: Maximum acceptable image size is 5MB. Please compress your image or choose a smaller one before uploading.");
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
        setNewBlog(prev => ({ ...prev, image: data.url }));
      } else {
        const errData = await res.json().catch(() => ({}));
        const errorMessage = errData.detail || 'Upload failed. Please check backend console for details.';
        console.error('Upload failed:', errorMessage);
        alert(`Image upload failed!\n\nPlease make sure:\n- Image size is less than 5MB\n- Format is JPG, PNG, or WEBP\n- Backend/Cloudinary is configured properly\n\nError Details: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(`Error uploading image!\n\nPlease make sure:\n- Image size is less than 5MB\n- Format is JPG, PNG, or WEBP\n\nError Details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;

    setSubmitting(true);
    try {
      const url = editingId ? `${API_BASE}/blogs/${editingId}` : `${API_BASE}/blogs/`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBlog)
      });

      if (res.ok) {
        const result = await res.json();
        if (editingId) {
          setBlogs(prev => prev.map(b => b.id === editingId ? result : b));
        } else {
          setBlogs(prev => [...prev, result]);
        }
        closeModal();
      }
    } catch (error) {
      console.error(`Failed to ${editingId ? 'update' : 'add'} blog:`, error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (blog: BlogPost) => {
    setEditingId(blog.id);
    setNewBlog({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      date: blog.date,
      image: blog.image,
      author: blog.author,
      read_time: blog.read_time
    });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingId(null);
    setNewBlog(initialFormState);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'All' || b.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const uniqueCategories = ['All', ...Array.from(new Set(blogs.map(b => b.category || 'Uncategorized')))];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">Blog Engine</h1>
          <p className="text-gray-400 font-bold">Create and manage your industrial insights and company updates.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-red hover:bg-brand-dark text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-brand-red/20 transition-all active:scale-95"
        >
          <Plus size={22} />
          Write New Post
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search blogs by title or category..."
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
              {uniqueCategories.map(c => <option key={c} value={c as string}>{c as string}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl h-[52px]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-3 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'}`}
              title="Table View"
            >
              <Layout size={18} />
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

      {/* Blog List View */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Articles...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Search size={48} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-xl font-black text-brand-dark mb-2">No matching blog posts</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your search or filter criteria.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-[0_30px_60px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Article Info</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Author</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={blog.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'} alt={blog.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-black text-brand-dark group-hover:text-brand-red transition-colors text-lg truncate">{blog.title}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{blog.read_time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full bg-red-50 text-brand-red border border-brand-red/10">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-brand-red font-black text-xs">{blog.author.charAt(0)}</div>
                        <p className="font-black text-brand-dark text-sm">{blog.author}</p>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{blog.date}</p>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEditClick(blog)}
                          className="w-10 h-10 hover:bg-blue-50 hover:text-blue-600 text-gray-300 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-blue-100"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="w-10 h-10 hover:bg-red-50 hover:text-brand-red text-gray-300 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                          title="Delete"
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all flex flex-col h-full"
            >
              {/* Actions Hover */}
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleEditClick(blog)} className="p-2 bg-white/90 hover:bg-blue-50 text-blue-600 rounded-xl backdrop-blur-sm shadow-sm transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 bg-white/90 hover:bg-red-50 text-brand-red rounded-xl backdrop-blur-sm shadow-sm transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="w-full h-48 rounded-2xl overflow-hidden mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop'} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full bg-white/90 text-brand-red backdrop-blur-md">
                  {blog.category}
                </span>
              </div>

              <div className="flex-1 flex flex-col">
                <h3 className="font-black text-brand-dark text-xl mb-3 line-clamp-2 leading-tight group-hover:text-brand-red transition-colors">{blog.title}</h3>
                <p className="text-gray-500 font-medium text-sm mb-6 line-clamp-2 leading-relaxed flex-1">{blog.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-brand-red font-black text-xs">{blog.author.charAt(0)}</div>
                    <span className="font-bold text-brand-dark text-xs">{blog.author}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{blog.date}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">{blog.read_time}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Blog Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-[40px] w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-brand-dark p-8 md:p-10 text-white flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center shadow-xl shadow-brand-red/20">
                    {editingId ? <Edit2 size={28} /> : <Plus size={28} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic">{editingId ? 'Edit Article' : 'Compose Article'}</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{editingId ? 'Updating Insights' : 'Knowledge Distribution Hub'}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <form className="space-y-10" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Title */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Type size={12} className="text-brand-red" /> Article Title
                      </label>
                      <input
                        type="text"
                        value={newBlog.title}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
                        placeholder="e.g. The Future of Industrial Automation"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Category */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                      <select
                        value={newBlog.category}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none"
                      >
                        <option value="Innovation">Innovation</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Company News">Company News</option>
                        <option value="Product Guide">Product Guide</option>
                      </select>
                    </div>
                    {/* Author */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Author</label>
                      <input
                        type="text"
                        value={newBlog.author}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, author: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        placeholder="Admin"
                      />
                    </div>
                    {/* Read Time */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Read Time</label>
                      <input
                        type="text"
                        value={newBlog.read_time}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, read_time: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        placeholder="5 min read"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <FileText size={12} className="text-brand-red" /> Brief Excerpt (Summary)
                    </label>
                    <textarea
                      rows={2}
                      value={newBlog.excerpt}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, excerpt: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none resize-none"
                      placeholder="Enter a short summary for the blog card..."
                    />
                  </div>

                  {/* Content (HTML) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Layout size={12} className="text-brand-red" /> Full Content
                    </label>
                    <textarea
                      rows={10}
                      value={newBlog.content}
                      onChange={(e) => setNewBlog(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none resize-none"
                      placeholder="Type your blog content here. Use double Enter (empty line) to start a new paragraph. No HTML needed!"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <ImageIcon size={12} className="text-brand-red" /> Featured Image
                    </label>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Upload Area */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer group ${newBlog.image ? 'border-green-100 bg-green-50/10' : 'border-gray-100 hover:border-brand-red/30 hover:bg-brand-red/5 bg-gray-50/30'
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
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${newBlog.image ? 'bg-green-100 text-green-600' : 'bg-white text-gray-400 group-hover:text-brand-red group-hover:scale-110 shadow-sm'
                              }`}>
                              {newBlog.image ? <Check size={28} /> : <Upload size={28} />}
                            </div>
                            <div className="text-center">
                              <p className="font-black text-brand-dark text-sm mb-1">
                                {newBlog.image ? 'Image Selected' : 'Drop image here or click to upload'}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                PNG, JPG, WEBP up to 5MB
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Preview Area */}
                      {newBlog.image && (
                        <div className="w-full md:w-48 h-48 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 relative group/preview">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={newBlog.image} alt="Preview" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewBlog(prev => ({ ...prev, image: '' }));
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
                        value={newBlog.image}
                        onChange={(e) => setNewBlog(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all text-xs"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-6 pt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-6 rounded-[24px] font-black text-gray-400 uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] bg-brand-dark hover:bg-brand-red text-white py-6 rounded-[24px] font-black text-xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="animate-spin" /> : <>{editingId ? 'Update Article' : 'Publish Article'} <Check size={24} className="group-hover:scale-125 transition-transform" /></>}
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
