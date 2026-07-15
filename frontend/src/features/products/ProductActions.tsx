'use client';

import React, { useState } from 'react';
import { ShoppingCart, User, Mail, Phone, Minus, Plus, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductActionsProps {
  price: number;
  productName: string;
  productImage?: string;
  productCategory?: string;
}

const ProductActions = ({ price, productName, productImage, productCategory }: ProductActionsProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const total = price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://aaj-tech-backend.onrender.com/api/enquiries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiryType: "Product Order Inquiry",
          message: `Inquiry for ${productName} (Quantity: ${quantity})`,
          productName: productName,
          quantity: quantity,
          totalPrice: total,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIsBuying(false);
          setSubmitted(false);
          setQuantity(1);
          setFormData({ name: '', email: '', phone: '' });
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit inquiry", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    if (url.startsWith('/')) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="mt-8">
      <AnimatePresence mode="wait">
        {!isBuying ? (
          <motion.div
            key="buy-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <button
              onClick={() => setIsBuying(true)}
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white px-10 py-6 rounded-[30px] font-black text-xl transition-all shadow-2xl shadow-brand-red/30 active:scale-95 flex items-center justify-center gap-4 group"
            >
              <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
              Buy Now / Request Quote
            </button>
            <p className="text-center text-gray-400 font-bold mt-4 text-sm uppercase tracking-widest">
              Instant Pricing Available
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="buy-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border-2 border-brand-red rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
          >
            {submitted ? (
              <div className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-brand-dark">Request Sent!</h3>
                  <p className="text-gray-500 font-bold">Our team will contact you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-brand-dark">Order Inquiry</h3>
                  <button
                    type="button"
                    onClick={() => setIsBuying(false)}
                    className="text-gray-400 hover:text-brand-red font-black text-sm uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>

                <div className="bg-brand-light rounded-[24px] p-4 flex items-center gap-4 border border-brand-red/10">
                  <div className="w-20 h-20 relative rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                    {isValidImageUrl(productImage) ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-cover"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <ShoppingCart size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-brand-red uppercase tracking-widest block mb-1">
                      {productCategory || 'Product Selection'}
                    </span>
                    <h4 className="font-extrabold text-brand-dark leading-tight line-clamp-2">
                      {productName}
                    </h4>
                    <p className="text-xs font-bold text-gray-400 mt-1">
                      Unit Price: ₹{price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="tel"
                      required
                      placeholder="+91 00000 00000"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 rounded-[30px] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-100">
                  <div className="flex flex-col items-center sm:items-start">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Adjust Quantity</p>
                    <div className="flex items-center bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 hover:text-brand-red transition-all text-gray-400"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-black text-brand-dark text-lg">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-50 hover:text-brand-red transition-all text-gray-400"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Estimated Price</p>
                    <p className="text-4xl font-black text-brand-red">₹{total.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-300 uppercase mt-1">Excluding GST & Shipping</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-dark hover:bg-brand-red text-white py-6 rounded-3xl font-black text-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      Confirm Inquiry
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductActions;
