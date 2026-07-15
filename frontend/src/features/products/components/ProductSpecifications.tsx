'use client';

import React, { useState } from 'react';
import { Settings, Zap, Thermometer, Gauge, Hash, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { formatLabel } from '@/utils/utils';

interface ProductSpecificationsProps {
  specifications?: Record<string, string | number | null | undefined>;
}

const IMPORTANT_KEYS = ['pins', 'pitch', 'current', 'voltage', 'temperature', 'contactResistance', 'insulationResistance'];

const KEY_ICONS: Record<string, React.ReactNode> = {
  current: <Zap size={16} className="text-amber-500" />,
  voltage: <Zap size={16} className="text-blue-500" />,
  temperature: <Thermometer size={16} className="text-red-500" />,
  pins: <Hash size={16} className="text-gray-500" />,
  pitch: <Gauge size={16} className="text-emerald-500" />,
};

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter out null, undefined, or empty values
  const validSpecs = specifications 
    ? Object.entries(specifications).filter(([, value]) => value !== null && value !== undefined && value !== '')
    : [];

  if (validSpecs.length === 0) {
    return (
      <div className="bg-brand-light/50 border border-brand-red/10 rounded-[32px] p-8 md:p-12 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-4" size={32} />
        <p className="text-gray-500 font-medium">No technical specifications available for this product.</p>
      </div>
    );
  }

  // Sort: Important keys first, then alphabetical
  const sortedSpecs = [...validSpecs].sort(([keyA], [keyB]) => {
    const isAImportant = IMPORTANT_KEYS.some(k => keyA.toLowerCase().includes(k.toLowerCase()));
    const isBImportant = IMPORTANT_KEYS.some(k => keyB.toLowerCase().includes(k.toLowerCase()));

    if (isAImportant && !isBImportant) return -1;
    if (!isAImportant && isBImportant) return 1;
    return keyA.localeCompare(keyB);
  });

  const displayedSpecs = isExpanded ? sortedSpecs : sortedSpecs.slice(0, 8);
  const hasMore = sortedSpecs.length > 8;

  const getIconForLabel = (label: string) => {
    const lowerLabel = label.toLowerCase();
    for (const [key, icon] of Object.entries(KEY_ICONS)) {
      if (lowerLabel.includes(key)) return icon;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-brand-light p-8 md:px-12 md:py-10 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-red/20">
            <Settings size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">Technical Specifications</h2>
            <p className="text-gray-500 text-sm font-medium">Detailed parameters and performance data</p>
          </div>
        </div>
        <span className="hidden md:inline-block bg-brand-red/10 text-brand-red text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
          Industrial Grade
        </span>
      </div>

      <div className="p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          {displayedSpecs.map(([key, value]) => {
            const label = formatLabel(key);
            const icon = getIconForLabel(label);
            const isImportant = IMPORTANT_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()));

            return (
              <div 
                key={key} 
                className="group flex justify-between items-center py-4 border-b border-gray-50 hover:bg-gray-50/50 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  {icon && <span className="shrink-0">{icon}</span>}
                  <span className="text-gray-500 font-semibold text-xs uppercase tracking-wider group-hover:text-brand-dark transition-colors">
                    {label}
                  </span>
                </div>
                <span className={`text-right font-bold ${isImportant ? 'text-brand-red' : 'text-brand-dark'}`}>
                  {String(value)}
                </span>
              </div>
            );
          })}
        </div>

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-10 w-full md:w-auto mx-auto flex items-center justify-center gap-2 text-brand-red font-bold hover:gap-3 transition-all px-8 py-3 rounded-2xl bg-brand-red/5 hover:bg-brand-red/10"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={20} />
              </>
            ) : (
              <>
                View All Specifications <ChevronDown size={20} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductSpecifications;
