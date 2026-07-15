// Placeholder for Category Management
// Page at src/features/admin/pages/CategoryManagement.tsx
import React from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';

export const CategoryManagement = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-black text-brand-dark mb-2">Categories</h1>
        <p className="text-gray-400 font-bold">Organize your products into logical groups.</p>
      </div>
      <button className="bg-brand-red text-white font-black px-6 py-4 rounded-2xl flex items-center gap-3">
        <Plus size={20} /> Add Category
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {['Connectors', 'Wire Harness', 'Battery Connectors', 'PCB Connectors'].map(cat => (
        <div key={cat} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-brand-red">
               <Layers size={20} />
             </div>
             <span className="font-black text-brand-dark">{cat}</span>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"><Edit2 size={16} /></button>
            <button className="p-2 hover:bg-red-50 text-brand-red rounded-lg"><Trash2 size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Catalog / Resource Management
export const CatalogManagement = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
       <h1 className="text-3xl font-black text-brand-dark">Resource Center</h1>
       <button className="bg-brand-dark text-white font-black px-6 py-4 rounded-2xl flex items-center gap-3">
         Upload Datasheet
       </button>
    </div>
    <div className="bg-white rounded-[32px] border border-gray-100 p-8 text-center py-20">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Plus size={32} className="text-gray-300" />
      </div>
      <h3 className="text-xl font-black text-brand-dark mb-2">No documents uploaded yet</h3>
      <p className="text-gray-400 font-medium max-w-xs mx-auto">Start by uploading technical specifications, catalogs or compliance certificates.</p>
    </div>
  </div>
);

// Client Management moved to dedicated component at src/features/admin/pages/ClientsManagement.tsx
