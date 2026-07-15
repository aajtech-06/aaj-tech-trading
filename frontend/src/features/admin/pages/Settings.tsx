'use client';

import React, { useState } from 'react';
import { 
  Building, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  CheckCircle2,
  Camera,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'profile', label: 'My Account', icon: User },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-dark mb-2">Settings</h1>
          <p className="text-gray-400 font-bold">Manage your organization and administrative preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-brand-dark hover:bg-brand-red text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 group"
        >
          {isSaved ? <CheckCircle2 size={20} className="text-green-400" /> : <Save size={20} />}
          {isSaved ? 'Changes Saved' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-brand-dark'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8 md:p-12"
          >
            {activeTab === 'company' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-gray-50">
                   <div className="relative group">
                     <div className="w-32 h-32 bg-gray-100 rounded-3xl overflow-hidden border-4 border-white shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://ui-avatars.com/api/?name=AAJ+Tech&background=D2232A&color=fff&size=128" alt="Company Logo" className="w-full h-full object-cover" />
                     </div>
                     <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-red hover:bg-brand-red hover:text-white transition-all">
                       <Camera size={18} />
                     </button>
                   </div>
                   <div className="text-center sm:text-left">
                     <h3 className="text-xl font-black text-brand-dark mb-1">Aaj Tech Trading Corp.</h3>
                     <p className="text-gray-400 font-bold mb-4">Official Organization Account</p>
                     <div className="flex flex-wrap gap-3">
                       <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100">Verified Vendor</span>
                       <span className="bg-purple-50 text-purple-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-purple-100">Pro Account</span>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Company Name</label>
                    <input type="text" defaultValue="Aaj Tech Trading Corporation" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Registration ID</label>
                    <input type="text" defaultValue="GST-2024-AAJ-99" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" />
                  </div>
                   <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Official Address</label>
                    <input type="text" defaultValue="Y-39, Ground Floor, Okhla Industrial Area, Phase II, New Delhi - 110020" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Support Email</label>
                    <input type="email" defaultValue="info@aajtechtrading.com" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Contact Phone</label>
                    <input type="text" defaultValue="+91-9910009227" className="w-full bg-gray-50 border-none rounded-2xl p-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Website Localization</h4>
                   <div className="flex gap-4">
                     <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                       <Globe className="text-brand-red" size={20} />
                       <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Language</p>
                         <p className="text-sm font-black text-brand-dark">English (Global)</p>
                       </div>
                     </div>
                      <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                       <Globe className="text-brand-red" size={20} />
                       <div>
                         <p className="text-xs font-bold text-gray-400 uppercase">Currency</p>
                         <p className="text-sm font-black text-brand-dark">INR (₹) / USD ($)</p>
                       </div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab !== 'company' && (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <SettingsIcon size={32} className="text-gray-300 animate-spin-slow" />
                 </div>
                 <h3 className="text-2xl font-black text-brand-dark mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                 <p className="text-gray-400 font-medium max-w-sm">This section is currently being updated for the premium dashboard experience.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
