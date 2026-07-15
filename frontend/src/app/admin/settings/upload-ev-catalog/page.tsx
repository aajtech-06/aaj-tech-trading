'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadEVCatalogPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
      const response = await fetch('https://aaj-tech-backend.onrender.com/api/ev-catalog/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        setMessage('EV Catalog uploaded successfully!');
        setFile(null);
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-brand-dark mb-2">Upload EV Catalog</h1>
        <p className="text-gray-400 font-bold">Update your EV product catalog with a new PDF version.</p>
      </div>

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
    </div>
  );
}
