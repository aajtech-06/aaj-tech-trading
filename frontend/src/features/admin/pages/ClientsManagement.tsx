'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Globe, Building2, MapPin, Package, Search, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Client {
  id: string;
  name: string;
  type: string;
  location: string;
  totalOrders: number;
  image: string;
  website: string;
  description: string;
}

export const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Search, Filter, View Mode
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [formData, setFormData] = useState({
    name: '',
    type: 'Client',
    location: '',
    totalOrders: 0,
    image: '',
    website: '',
    description: ''
  });

  const fetchClients = async () => {
    try {
      const res = await fetch('https://aaj-tech-backend.onrender.com/api/clients/');
      const data = await res.json();
      setClients(data);
    } catch {
      console.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchClients();
  }, []);

  const handleOpenModal = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || '',
        type: client.type || 'Client',
        location: client.location || '',
        totalOrders: client.totalOrders || 0,
        image: client.image || '',
        website: client.website || '',
        description: client.description || ''
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        type: 'Client',
        location: '',
        totalOrders: 0,
        image: '',
        website: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingClient ? 'PUT' : 'POST';
      const url = editingClient
        ? `https://aaj-tech-backend.onrender.com/api/clients/${editingClient.id}`
        : 'https://aaj-tech-backend.onrender.com/api/clients/';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        await fetchClients();
        handleCloseModal();
      }
    } catch {
      console.error('Failed to save client');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      const res = await fetch(`https://aaj-tech-backend.onrender.com/api/clients/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchClients();
      }
    } catch {
      console.error('Failed to delete client');
    }
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.location && client.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterType === 'All' || client.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = ['All', ...Array.from(new Set(clients.map(c => c.type || 'Client')))];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark mb-2">Clients & Distributors</h1>
          <p className="text-gray-400 font-bold">Manage your global network of partners and clients.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-brand-red text-white font-black px-6 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-brand-red/20 hover:bg-brand-red/90 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} /> Add Client
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 w-full md:w-auto gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none bg-gray-50 border-none rounded-xl py-3 pl-12 pr-10 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all cursor-pointer"
            >
              {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'}`}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-brand-red' : 'text-gray-400 hover:text-brand-dark'}`}
            title="Table View"
          >
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading Network...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Building2 size={48} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-xl font-black text-brand-dark mb-2">No clients added yet</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Start building your network by adding your first client or distributor.</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
          <Search size={48} className="mx-auto text-gray-200 mb-6" />
          <h3 className="text-xl font-black text-brand-dark mb-2">No matching clients</h3>
          <p className="text-gray-400 font-medium max-w-sm mx-auto">Try adjusting your search or filter criteria.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-150" />

              {/* Actions */}
              <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button onClick={() => handleOpenModal(client)} className="p-2 bg-white/80 hover:bg-blue-50 text-blue-600 rounded-xl backdrop-blur-sm shadow-sm transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(client.id)} className="p-2 bg-white/80 hover:bg-red-50 text-brand-red rounded-xl backdrop-blur-sm shadow-sm transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                  {client.image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.image} alt={client.name} className="w-full h-full object-contain" />
                    </>
                  ) : (
                    <Building2 className="text-gray-300" size={32} />
                  )}
                </div>
                <div className="pr-12">
                  <p className="font-black text-brand-dark text-lg leading-tight mb-1">{client.name}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{client.type}</p>
                </div>
              </div>

              {client.description && (
                <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-2 leading-relaxed">
                  {client.description}
                </p>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={14} />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                    <span className="text-brand-dark font-bold">{client.location || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <Package size={14} />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Orders</span>
                    <span className="text-brand-dark font-bold">{client.totalOrders || '0'}</span>
                  </div>
                </div>
              </div>

              {client.website && (
                <a
                  href={client.website.startsWith('http') ? client.website : `https://${client.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-2xl font-black text-sm transition-all text-brand-dark uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Globe size={16} /> Visit Website
                </a>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Client</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Location</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Type</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Total Orders</th>
                  <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                          {client.image ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={client.image} alt={client.name} className="w-full h-full object-contain" />
                            </>
                          ) : (
                            <Building2 className="text-gray-300" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark text-sm">{client.name}</p>
                          {client.website && (
                            <a href={client.website.startsWith('http') ? client.website : `https://${client.website}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-gray-400 hover:text-brand-red flex items-center gap-1 mt-0.5">
                              <Globe size={10} /> {client.website.replace(/^https?:\/\//, '')}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-600">{client.location || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-red-50 text-brand-red rounded-full text-[10px] font-black uppercase tracking-widest">
                        {client.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-black text-brand-dark">{client.totalOrders || '0'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(client)} className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-2 hover:bg-red-50 text-gray-400 hover:text-brand-red rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight">
                  {editingClient ? 'Edit Client Profile' : 'Add New Client'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <form id="clientForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Company Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="e.g. Partner Corp"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Client Type</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none"
                      >
                        <option value="Client">Client</option>
                        <option value="Premium Distributor">Premium Distributor</option>
                        <option value="Retail Partner">Retail Partner</option>
                        <option value="Wholesale">Wholesale</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="e.g. Berlin, DE"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Total Orders</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.totalOrders}
                        onChange={(e) => setFormData({ ...formData, totalOrders: parseInt(e.target.value) || 0 })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Image / Logo URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-400 mt-2 font-medium">Paste a direct link to the client&apos;s logo or photo.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Website URL</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-brand-dark uppercase tracking-widest mb-2">Description / Notes</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-brand-dark font-medium focus:ring-2 focus:ring-brand-red outline-none resize-none"
                      placeholder="Brief details about the client relationship..."
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-4 bg-gray-50/50 shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="clientForm"
                  disabled={isSubmitting}
                  className="bg-brand-red hover:bg-brand-red/90 text-white px-8 py-3 rounded-xl font-black transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : 'Save Client'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
