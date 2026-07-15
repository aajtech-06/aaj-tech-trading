'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, ArrowRight, Loader2, CheckCircle2, X } from 'lucide-react';

export default function InquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Avoid running on server-side rendering
    if (typeof window === 'undefined') return;

    // Check if the form was already closed or submitted in this session
    const isClosed = sessionStorage.getItem('inquiry_form_closed') === 'true';
    const isSubmitted = sessionStorage.getItem('inquiry_form_submitted') === 'true';

    if (isClosed || isSubmitted) return;

    // Initialize or get the session start time
    let sessionStart = sessionStorage.getItem('session_start_time');
    if (!sessionStart) {
      sessionStart = Date.now().toString();
      sessionStorage.setItem('session_start_time', sessionStart);
    }

    const elapsed = Date.now() - parseInt(sessionStart, 10);
    // 20 seconds = 20,000 milliseconds
    const targetDelay = 20000;
    const remainingTime = Math.max(0, targetDelay - elapsed);

    const timer = setTimeout(() => {
      const stillClosed = sessionStorage.getItem('inquiry_form_closed') === 'true';
      const stillSubmitted = sessionStorage.getItem('inquiry_form_submitted') === 'true';

      if (!stillClosed && !stillSubmitted) {
        setIsOpen(true);
      }
    }, remainingTime);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('inquiry_form_closed', 'true');
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      inquiryType: formData.get('inquiryType'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('https://aaj-tech-backend.onrender.com/api/enquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccess(true);
        sessionStorage.setItem('inquiry_form_submitted', 'true');
        // Reset form data and auto close modal after 4 seconds on success
        setTimeout(() => {
          setIsOpen(false);
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-brand-dark/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-3xl bg-white rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-gray-100 p-8 md:p-12 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-brand-red rounded-full hover:bg-gray-50 transition-colors z-20 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-brand-dark mb-4">Inquiry Deployed!</h3>
                  <p className="text-gray-600 font-medium max-w-md mx-auto text-base">
                    Thank you for reaching out. A confirmation email has been sent to your inbox.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-8 bg-brand-dark hover:bg-brand-red text-white px-8 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    Close Window
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-red/20 shrink-0">
                      <Headphones size={28} />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Send an Inquiry</h2>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Avg Response Time: 4 Hours
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Full Name
                        </label>
                        <input
                          name="fullName"
                          type="text"
                          placeholder="Enter your name"
                          className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Corporate Email
                        </label>
                        <input
                          name="email"
                          type="email"
                          placeholder="name@company.com"
                          className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Phone Number
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="+91 00000 00000"
                          className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Inquiry Type
                        </label>
                        <div className="relative">
                          <select
                            name="inquiryType"
                            className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none cursor-pointer"
                          >
                            <option>Product Quotation</option>
                            <option>Technical Support</option>
                            <option>Dealership Request</option>
                            <option>Shipping & Logistics</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Your Requirements
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        placeholder="Tell us about your project or specific component needs..."
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-brand-red/5 border border-brand-red/10 p-4 rounded-2xl text-brand-red text-sm font-bold text-center">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-200 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3 group active:scale-[0.98] cursor-pointer"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : (
                        <>
                          Send
                          <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </>
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
