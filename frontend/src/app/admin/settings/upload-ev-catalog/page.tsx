'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Edit2, Trash2, Check, X, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadEVCatalogPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  // Existing catalogs state
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);
  const [editingFilename, setEditingFilename] = useState<string | null>(null);
  const [newFilename, setNewFilename] = useState('');
  const [renaming, setRenaming] = useState(false);

  const fetchCatalogs = async () => {
    try {
      setLoadingCatalogs(true);
      const response = await fetch('https://aajtechtrading.in/api/ev-catalog/');
      if (response.ok) {
        const data = await response.json();
        setCatalogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch EV catalogs:', error);
    } finally {
      setLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchCatalogs();
    }, 0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setStatus('error');
        setMessage('Please upload a PDF file.');
        return;
      }
      setFile(selectedFile);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://aajtechtrading.in/api/ev-catalog/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        setMessage('EV Catalog uploaded successfully!');
        setFile(null);
        fetchCatalogs(); // Refresh existing catalogs
      } else {
        const data = await response.json();
        setStatus('error');
        setMessage(data.detail || 'Upload failed.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCatalog = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete EV Catalog "${filename}"? This will permanently remove the document.`)) return;
    
    try {
      const response = await fetch(`https://aajtechtrading.in/api/ev-catalog/${filename}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCatalogs();
      } else {
        alert('Failed to delete EV catalog.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    }
  };

  const handleRenameCatalog = async (oldFilename: string) => {
    if (!newFilename.trim()) return;
    setRenaming(true);
    
    try {
      const response = await fetch(
        `https://aajtechtrading.in/api/ev-catalog/${oldFilename}/rename?new_name=${encodeURIComponent(newFilename)}`,
        {
          method: 'PUT',
        }
      );
      if (response.ok) {
        setEditingFilename(null);
        setNewFilename('');
        fetchCatalogs();
      } else {
        alert('Failed to rename EV catalog.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black text-brand-dark mb-2">Upload EV Catalog</h1>
        <p className="text-gray-400 font-bold">Update your EV product catalog with a new PDF version.</p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-[40px] border border-gray-100 p-12 shadow-sm">
        <div
          className={`border-4 border-dashed rounded-[32px] p-16 text-center transition-all ${file ? 'border-green-100 bg-green-50/30' : 'border-gray-50 hover:border-brand-red/20 hover:bg-brand-red/[0.02]'
            }`}
        >
          <input
            type="file"
            id="ev-catalog-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <label htmlFor="ev-catalog-upload" className="cursor-pointer">
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6 transition-all ${file ? 'bg-green-500 text-white' : 'bg-brand-light text-brand-red'
              }`}>
              {file ? <FileText size={32} /> : <Upload size={32} />}
            </div>

            {file ? (
              <div className="space-y-2">
                <p className="text-xl font-black text-brand-dark">{file.name}</p>
                <p className="text-sm font-bold text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-black text-brand-dark">Click to browse or drag & drop</p>
                <p className="text-sm font-bold text-gray-400">Only PDF files are supported</p>
              </div>
            )}
          </label>
        </div>

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle size={20} /> {message}
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-red-50 text-brand-red rounded-2xl flex items-center gap-3 font-bold"
          >
            <AlertCircle size={20} /> {message}
          </motion.div>
        )}

        <div className="mt-12 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-12 py-5 rounded-full font-black text-lg transition-all flex items-center gap-3 ${!file || uploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-brand-red text-white hover:bg-brand-red-hover shadow-xl shadow-brand-red/20 active:scale-95'
              }`}
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="animate-spin" /> Uploading...
              </>
            ) : (
              <>
                Publish EV Catalog <Upload size={24} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* EV Catalog List / Management Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-brand-dark mb-1">Manage Existing EV Catalogs</h2>
          <p className="text-gray-400 font-bold text-sm">Rename or delete EV catalog documents published on Cloudinary.</p>
        </div>

        {loadingCatalogs ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-brand-red" size={32} />
          </div>
        ) : catalogs.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-gray-100 p-12 text-center">
            <p className="text-gray-400 font-bold">No EV catalogs found. Upload a PDF file above to publish one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {catalogs.map((catalog) => (
              <div
                key={catalog.url}
                className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand-red shrink-0">
                    <FileText size={22} />
                  </div>
                  
                  {editingFilename === catalog.name ? (
                    <div className="flex items-center gap-2 w-full max-w-md">
                      <input
                        type="text"
                        value={newFilename}
                        onChange={(e) => setNewFilename(e.target.value)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-brand-dark outline-none focus:border-brand-red transition-all"
                        placeholder="new_name.pdf"
                      />
                      <button
                        onClick={() => handleRenameCatalog(catalog.name)}
                        disabled={renaming || !newFilename.trim()}
                        className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors disabled:opacity-50"
                        title="Save rename"
                      >
                        {renaming ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button
                        onClick={() => setEditingFilename(null)}
                        className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-brand-dark text-sm sm:text-base truncate">{catalog.name}</p>
                      <a
                        href={catalog.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-red hover:underline font-bold mt-1"
                      >
                        Open Catalog <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {editingFilename !== catalog.name && (
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        setEditingFilename(catalog.name);
                        setNewFilename(catalog.name);
                      }}
                      className="p-3 hover:bg-gray-50 text-gray-500 hover:text-brand-red rounded-xl transition-all"
                      title="Edit Catalog Name"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCatalog(catalog.name)}
                      className="p-3 hover:bg-red-50 text-red-400 hover:text-brand-red rounded-xl transition-all"
                      title="Delete Catalog"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
