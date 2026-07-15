'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,

  MessageCircle,
  Headphones,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const contactInfo = [
    {
      icon: Phone,
      title: 'Voice Support',
      values: ['+91-9910009227', '+91-9971002657'],
      sub: 'Mon - Sat: 9AM - 7PM',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: 'Email Queries',
      values: ['info@aajtechtrading.com', 'accountattc@hotmail.com'],
      sub: 'Response within 24 hours',
      color: 'bg-brand-red'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      values: ['AAJ TECH TRADING CORPORATION, Ground Floor, Y-39, near Harkesh Nagar metro station, phase-II, Sanjay Colony, Okhla Phase II, Okhla Industrial Area, New Delhi, Delhi 110020'],
      sub: 'Visit our experience center',
      color: 'bg-orange-500'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Support',
      values: ['+91-9910009227'],
      sub: 'For instant technical help',
      color: 'bg-green-500'
    },
  ];

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
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsSuccess(false), 5000);
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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-48 pb-24 overflow-hidden bg-brand-dark">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-black uppercase tracking-[0.3em] mb-8">
              Connect with Experts
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
              Let&apos;s Engineer Your <br />
              <span className="text-brand-red">Success Together.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              Global leaders in industrial component trading. Reach out for bulk inquiries, technical specifications, or dealership opportunities.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white p-8 md:p-16 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.06)] border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-12">
              <div className="w-14 h-14 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-red/20">
                <Headphones size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-brand-dark">Send an Inquiry</h2>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Avg Response Time: 4 Hours</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-green-50 rounded-[32px] p-12 text-center border border-green-100"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-2">Inquiry Deployed!</h3>
                  <p className="text-gray-600 font-medium">Thank you for reaching out. A confirmation email has been sent to your inbox.</p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-brand-red font-black uppercase tracking-widest text-xs hover:underline"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input
                        name="fullName"
                        type="text"
                        placeholder="Enter your name"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Email</label>
                      <input
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="+91 00000 00000"
                        className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                      <select name="inquiryType" className="w-full bg-gray-50 border-none rounded-2xl py-5 px-6 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all appearance-none">
                        <option>Product Quotation</option>
                        <option>Technical Support</option>
                        <option>Dealership Request</option>
                        <option>Shipping & Logistics</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Requirements</label>
                    <textarea
                      name="message"
                      rows={6}
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
                    className="w-full bg-brand-dark hover:bg-brand-red disabled:bg-gray-200 text-white py-6 rounded-2xl font-black text-xl transition-all shadow-xl shadow-brand-dark/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
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
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                >
                  <div className={`w-12 h-12 ${item.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon size={22} />
                  </div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{item.title}</h4>
                  <div className="space-y-2">
                    {item.values.map(v => {
                      if (item.title === 'Email Queries') {
                        return (
                          <a
                            key={v}
                            href={`mailto:${v}`}
                            className="text-brand-dark hover:text-brand-red font-black text-sm leading-tight block hover:underline transition-all"
                          >
                            {v}
                          </a>
                        );
                      }
                      if (item.title === 'Voice Support') {
                        return (
                          <a
                            key={v}
                            href={`tel:${v.replace(/[^0-9+]/g, '')}`}
                            className="text-brand-dark hover:text-brand-red font-black text-sm leading-tight block hover:underline transition-all"
                          >
                            {v}
                          </a>
                        );
                      }
                      if (item.title === 'WhatsApp Support') {
                        return (
                          <a
                            key={v}
                            href={`https://wa.me/${v.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-dark hover:text-brand-red font-black text-sm leading-tight block hover:underline transition-all"
                          >
                            {v}
                          </a>
                        );
                      }
                      if (item.title === 'Headquarters') {
                        return (
                          <a
                            key={v}
                            href="https://maps.google.com/maps?q=AAJ%20TECH%20TRADING%20CORPORATION,%20Ground%20Floor,%20Y-39,%20near%20Harkesh%20Nagar%20metro%20station,%20phase-II,%20Sanjay%20Colony,%20Okhla%20Phase%20II,%20Okhla%20Industrial%20Area,%20New%20Delhi,%20Delhi%20110020"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-dark hover:text-brand-red font-black text-sm leading-tight block hover:underline transition-all"
                          >
                            {v}
                          </a>
                        );
                      }
                      return (
                        <p key={v} className="text-brand-dark font-black text-sm leading-tight">
                          {v}
                        </p>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-brand-light p-10 rounded-[40px] border border-gray-200"
            >
              <h3 className="text-xl font-black text-brand-dark mb-6 flex items-center gap-3">
                <MapPin className="text-brand-red" size={20} />
                Global Location
              </h3>
              <div className="h-[400px] w-full rounded-[30px] overflow-hidden border border-gray-200 shadow-inner mt-6">
                <iframe
                  src="https://maps.google.com/maps?q=AAJ%20TECH%20TRADING%20CORPORATION,%20Ground%20Floor,%20Y-39,%20near%20Harkesh%20Nagar%20metro%20station,%20phase-II,%20Sanjay%20Colony,%20Okhla%20Phase%20II,%20Okhla%20Industrial%20Area,%20New%20Delhi,%20Delhi%20110020&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default ContactPage;
