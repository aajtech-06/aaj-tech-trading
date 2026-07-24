'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, X, ClipboardList } from 'lucide-react';
import Image from 'next/image';

interface HarnessProduct {
  id: string;
  title: string;
  image: string;
  details?: string;
  voltageType?: string;
  subcategory?: string;
}

interface HarnessInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: HarnessProduct | null;
}

export default function HarnessInquiryModal({ isOpen, onClose, product }: HarnessInquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const qty = parseInt(formData.get('quantity') as string, 10);

    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email') || null, // Optional
      phone: formData.get('phone'),
      inquiryType: 'Harness Inquiry',
      productName: product.title,
      quantity: isNaN(qty) ? 100 : qty,
      message: formData.get('message'),
    };

    try {
      const res = await fetch('https://aajtechtrading.in/api/enquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccess(true);
        // Auto-close modal after 4 seconds on success
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 4000);
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Failed to send inquiry.');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/70 backdrop-blur-md animate-fade-in"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[32px] shadow-[0_50px_100px_rgba(0,0,0,0.25)] border border-gray-100 dark:border-neutral-800 p-6 md:p-10 z-10 my-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-red hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-green-500/20">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-brand-dark dark:text-white uppercase tracking-tight mb-4">
                    Inquiry Received!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-semibold max-w-md mx-auto text-sm leading-relaxed">
                    Thank you! Your wire harness request has been logged. Our engineering team will review the details and respond with a customized quotation shortly.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-8 bg-brand-red hover:bg-brand-dark text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Title Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-brand-red text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand-red/20 shrink-0">
                      <ClipboardList size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight">
                        Wire Harness Order Inquiry
                      </h2>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-0.5">
                        Send specifications for direct quotation
                      </p>
                    </div>
                  </div>

                  {/* Product Summary banner inside the form */}
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-neutral-950 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 mb-6">
                    <div className="w-16 h-16 bg-white dark:bg-neutral-900 border border-gray-150 dark:border-neutral-800 rounded-xl overflow-hidden relative shrink-0 flex items-center justify-center p-1.5">
                      <Image
                        src={product.image?.startsWith('http') ? product.image : (product.image?.startsWith('/uploads/') ? `https://aajtechtrading.in${product.image}` : (product.image || "/Wire to board Assemblies.webp"))}
                        alt={product.title}
                        width={60}
                        height={60}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="bg-brand-red/10 text-brand-red dark:bg-brand-red/20 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-brand-red/10 block w-max mb-1">
                        {product.voltageType || 'Wire Harness'}
                      </span>
                      <h4 className="font-black text-brand-dark dark:text-white text-sm truncate uppercase tracking-tight">
                        {product.title}
                      </h4>
                      {product.subcategory && (
                        <p className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">
                          Category: {product.subcategory}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Form fields */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest ml-1">
                          Full Name *
                        </label>
                        <input
                          name="fullName"
                          type="text"
                          placeholder="Your name or company rep"
                          className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-xl py-3.5 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                          required
                        />
                      </div>
                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest ml-1 flex justify-between">
                          <span>Email Address</span>
                          <span className="text-gray-400 dark:text-neutral-600 font-bold lowercase italic">Optional</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          placeholder="email@company.com"
                          className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-xl py-3.5 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Phone */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest ml-1">
                          Phone Number *
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="Contact number"
                          className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-xl py-3.5 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                          required
                        />
                      </div>
                      {/* Quantity */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest ml-1">
                          Required Quantity (MOQ: 100 PCS) *
                        </label>
                        <input
                          name="quantity"
                          type="number"
                          min="1"
                          defaultValue="100"
                          placeholder="100"
                          className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-xl py-3.5 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    {/* Requirement/Description */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest ml-1">
                        Inquiry Details / Custom Specifications *
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Detail spacing, connectors, bottom plates, wiring lengths, environmental requirements, etc."
                        className="w-full bg-gray-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 rounded-xl py-3.5 px-4 font-bold text-xs text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-brand-red/5 border border-brand-red/10 p-3.5 rounded-xl text-brand-red text-xs font-bold text-center">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-red hover:bg-brand-dark disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-red/10 hover:shadow-brand-red/20 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        'Submit Inquiry'
                      )}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
