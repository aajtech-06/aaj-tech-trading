'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Download } from 'lucide-react';
import ProductSpecifications from './ProductSpecifications';

interface ProductAccordionProps {
  specifications?: Record<string, string | number | null | undefined>;
  description?: string;
  datasheet?: string;
}

export default function ProductAccordion({ specifications, description, datasheet }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('specs');

  const toggleSection = (section: string) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const hasDesc = !!description && description.trim() !== '';
  const hasDatasheet = !!datasheet && datasheet.trim() !== '';

  return (
    <div className="space-y-4 max-w-full">
      {/* 1. Technical Specification Accordion */}
      <div className="border border-gray-200 dark:border-neutral-800 rounded-[28px] bg-white dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection('specs')}
          className="w-full flex items-center justify-between p-6 md:p-8 font-black text-brand-dark dark:text-white hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors text-left"
        >
          <span className="text-sm md:text-base uppercase tracking-wider">Technical Specification</span>
          {openSection === 'specs' ? <ChevronUp size={20} className="text-brand-red" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {openSection === 'specs' && (
          <div className="border-t border-gray-100 dark:border-neutral-800 p-2 md:p-6 bg-white dark:bg-neutral-900">
            <ProductSpecifications specifications={specifications} />
          </div>
        )}
      </div>

      {/* 2. Product Description Accordion */}
      <div className="border border-gray-200 dark:border-neutral-800 rounded-[28px] bg-white dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection('desc')}
          className="w-full flex items-center justify-between p-6 md:p-8 font-black text-brand-dark dark:text-white hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors text-left"
        >
          <span className="text-sm md:text-base uppercase tracking-wider">Product Description</span>
          {openSection === 'desc' ? <ChevronUp size={20} className="text-brand-red" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {openSection === 'desc' && (
          <div className="border-t border-gray-100 dark:border-neutral-800 p-6 md:p-8 text-gray-600 dark:text-gray-300 font-bold text-sm leading-relaxed whitespace-pre-line bg-white dark:bg-neutral-900">
            {hasDesc ? description : "No additional description available."}
          </div>
        )}
      </div>

      {/* 3. Product Documents Accordion */}
      <div className="border border-gray-200 dark:border-neutral-800 rounded-[28px] bg-white dark:bg-neutral-900 overflow-hidden shadow-sm transition-all duration-300">
        <button
          type="button"
          onClick={() => toggleSection('docs')}
          className="w-full flex items-center justify-between p-6 md:p-8 font-black text-brand-dark dark:text-white hover:bg-gray-50/50 dark:hover:bg-neutral-800/50 transition-colors text-left"
        >
          <span className="text-sm md:text-base uppercase tracking-wider">
            Product Documents (1)
          </span>
          {openSection === 'docs' ? <ChevronUp size={20} className="text-brand-red" /> : <ChevronDown size={20} className="text-gray-400" />}
        </button>
        {openSection === 'docs' && (
          <div className="border-t border-gray-100 dark:border-neutral-800 p-6 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-4 p-6 rounded-2xl border border-emerald-500/20 dark:border-emerald-500/10 bg-emerald-50/5 dark:bg-emerald-950/5">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <FileText size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-sm text-emerald-700 dark:text-emerald-400">Datasheet</h4>
                <p className="text-xs text-gray-400 font-semibold mb-1">Datasheet</p>
                {hasDatasheet ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-bold text-emerald-600">File available</span>
                    <span className="text-gray-300">|</span>
                    <a
                      href={datasheet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Download size={12} className="inline mr-1" /> Download PDF
                    </a>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500">File unavailable</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
