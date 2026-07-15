'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, Save, Loader2, Trash2, Users, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '@/features/admin/hooks/useAdminAuth';

interface AdminUser {
  _id?: string;
  email: string;
  name?: string;
}

export default function ManageLoginPage() {
  const { user } = useAdminAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [fetchingAdmins, setFetchingAdmins] = useState(true);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setFetchingAdmins(true);
      const res = await fetch('/api/admin/manage-login');
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch {
      console.error('Failed to fetch admins');
    } finally {
      setFetchingAdmins(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdmins();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/admin/manage-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setFormData({ email: '', name: '', password: '' });
        fetchAdmins(); // Refresh the list
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch {
      setError('Failed to update credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email}?`)) return;
    
    setDeletingEmail(email);
    setError('');
    setMessage('');
    
    try {
      const res = await fetch('/api/admin/manage-login', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage(data.message);
        fetchAdmins(); // Refresh list
      } else {
        setError(data.message || 'Failed to remove admin');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setDeletingEmail(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-brand-dark tracking-tight mb-2">Manage Logins</h1>
        <p className="text-gray-500 font-medium">Control who has access to the admin portal.</p>
      </div>
      
      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl font-medium text-sm border border-green-100 flex items-center gap-3">
          <Shield size={20} /> {message}
        </motion.div>
      )}
      
      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 text-brand-red rounded-2xl font-medium text-sm border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm sticky top-24"
          >
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center text-brand-red">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-dark">Security Settings</h2>
                <p className="text-sm text-gray-400">Add or update admin.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-brand-dark text-sm font-medium focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">Full Name (Optional)</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-brand-dark text-sm font-medium focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                    placeholder="Admin Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-2">New Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-brand-dark text-sm font-medium focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-dark hover:bg-brand-red text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-brand-red/20"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                  {loading ? 'Saving...' : 'Save Credentials'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Right Column - List of Admins */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm h-full"
          >
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-brand-dark">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-brand-dark">Active Admins</h2>
                  <p className="text-sm text-gray-400">Manage current users</p>
                </div>
              </div>
              <div className="bg-brand-light text-brand-red font-black text-xs px-3 py-1.5 rounded-full tracking-widest">
                {admins.length} {admins.length === 1 ? 'MEMBER' : 'MEMBERS'}
              </div>
            </div>

            {fetchingAdmins ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-gray-300 animate-spin mb-4" />
                <p className="text-sm font-bold text-gray-400">Loading Members...</p>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                <Shield size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-500">No admins found</h3>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {admins.map((admin) => (
                    <motion.div
                      key={admin._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, marginBottom: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-red/30 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-brand-dark font-black border border-gray-200">
                          {admin.name ? admin.name.charAt(0).toUpperCase() : admin.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-brand-dark text-sm">{admin.name || 'Admin User'}</p>
                          <p className="text-xs font-medium text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {user?.email === admin.email && (
                          <span className="text-[10px] font-black tracking-widest text-brand-red bg-brand-light px-2 py-1 rounded-md uppercase">
                            You
                          </span>
                        )}
                        
                        <button
                          onClick={() => handleDelete(admin.email)}
                          disabled={deletingEmail === admin.email || user?.email === admin.email}
                          className={`p-2 rounded-xl transition-all ${
                            user?.email === admin.email 
                              ? 'opacity-30 cursor-not-allowed text-gray-400' 
                              : 'text-gray-400 hover:text-brand-red hover:bg-brand-light'
                          }`}
                          title={user?.email === admin.email ? "Cannot delete yourself" : "Remove Admin"}
                        >
                          {deletingEmail === admin.email ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
        
      </div>
    </div>
  );
}
