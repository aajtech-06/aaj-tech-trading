'use client';

import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType: string;
  productName?: string;
  quantity?: number;
  totalPrice?: number;
  message: string;
  status: string;
  createdAt: string;
}

export default function EnquiryManagement({ filterType }: { filterType?: string }) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  const fetchEnquiries = React.useCallback(async () => {
    try {
      const res = await fetch('https://aaj-tech-backend.onrender.com/api/enquiries/');
      if (res.ok) {
        let data = await res.json();

        // Apply filter if filterType is provided
        if (filterType === 'order') {
          data = data.filter((enq: Enquiry) => enq.inquiryType === 'Product Order Inquiry');
        } else if (filterType === 'general') {
          data = data.filter((enq: Enquiry) => enq.inquiryType !== 'Product Order Inquiry');
        }

        setEnquiries(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [filterType]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEnquiries();
  }, [fetchEnquiries]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`https://aaj-tech-backend.onrender.com/api/enquiries/${id}/status?status=${status}`, {
        method: 'PUT',
      });
      if (res.ok) {
        fetchEnquiries();
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`https://aaj-tech-backend.onrender.com/api/enquiries/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchEnquiries();
        setSelectedEnquiry(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-brand-dark mb-2">
          {filterType === 'order' ? 'Order Inquiries' : filterType === 'general' ? 'General Enquiries' : 'All Enquiries'}
        </h1>
        <p className="text-gray-400 font-bold">
          {filterType === 'order'
            ? 'Track and respond to product purchase requests and RFQs.'
            : 'Manage general contact messages and service inquiries.'}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[24px] border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by company or client name..."
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select className="flex-1 lg:flex-none px-6 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 font-bold focus:ring-2 focus:ring-brand-red transition-all outline-none appearance-none">
            <option>All Status</option>
            <option>New</option>
            <option>Replied</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Inquiry Date</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Client & Email</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedEnquiry(enq)}>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-300" />
                      <span className="text-sm font-bold text-brand-dark">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div>
                      <p className="font-black text-brand-dark group-hover:text-brand-red transition-colors">{enq.fullName}</p>
                      <p className="text-xs font-bold text-gray-400">{enq.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-gray-600 line-clamp-1">
                      {enq.productName ? `Order: ${enq.productName}` : enq.inquiryType}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${enq.status === 'New' ? 'bg-blue-50 text-blue-600' :
                      enq.status === 'Replied' ? 'bg-orange-50 text-orange-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button onClick={(e) => { e.stopPropagation(); deleteEnquiry(enq.id); }} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-all">
                      <X size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enquiry Details Drawer */}
      <AnimatePresence>
        {selectedEnquiry && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-[210] shadow-2xl p-8 lg:p-12 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-red/5 text-brand-red rounded-2xl flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark">Inquiry Detail</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">ID: {selectedEnquiry.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-10">
                {selectedEnquiry.productName && (
                  <div className="bg-brand-red/5 rounded-3xl p-6 border border-brand-red/10">
                    <h3 className="text-xs font-black text-brand-red uppercase tracking-widest mb-6 border-l-2 border-brand-red pl-4">Requested Product</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400">Product Name</span>
                        <span className="text-sm font-black text-brand-dark">{selectedEnquiry.productName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400">Quantity</span>
                        <span className="text-sm font-black text-brand-dark">{selectedEnquiry.quantity} Units</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400">Estimated Total</span>
                        <span className="text-sm font-black text-brand-red text-lg">₹{selectedEnquiry.totalPrice?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-3xl p-6">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 border-l-2 border-brand-red pl-4">Client Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400">Contact Person</span>
                      <span className="text-sm font-black text-brand-dark">{selectedEnquiry.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400">Email Address</span>
                      <span className="text-sm font-black text-brand-dark">{selectedEnquiry.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-400">Phone Number</span>
                      <span className="text-sm font-black text-brand-dark">{selectedEnquiry.phone}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <a href={`mailto:${selectedEnquiry.email}`} className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-sm font-black text-brand-dark hover:border-brand-red transition-all">
                      <Mail size={16} className="text-brand-red" /> Email
                    </a>
                    <a href={`tel:${selectedEnquiry.phone}`} className="flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl text-sm font-black text-brand-dark hover:border-brand-red transition-all">
                      <Phone size={16} className="text-brand-red" /> Call
                    </a>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-2 border-brand-red pl-4">Inquiry Content</h3>
                  <div className="p-6 bg-white border border-gray-100 rounded-3xl">
                    <p className="text-lg font-black text-brand-dark mb-4">{selectedEnquiry.inquiryType}</p>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      {selectedEnquiry.message}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-l-2 border-brand-red pl-4">Internal Actions</h3>
                  <div className="flex flex-col gap-3">
                    {selectedEnquiry.status !== 'Replied' && (
                      <button
                        onClick={() => updateStatus(selectedEnquiry.id, 'Replied')}
                        className="w-full bg-brand-dark text-white py-4 rounded-2xl font-black text-sm hover:bg-brand-red transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} /> Mark as Replied
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(selectedEnquiry.id, 'Closed')}
                      className="w-full bg-gray-50 text-gray-500 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all"
                    >
                      Close Enquiry
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
