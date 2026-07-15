'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Download,
  BookOpen,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Loader2,
  Book
} from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import Flipbook from '@/features/products/components/Flipbook';

interface CatalogItem {
  name: string;
  url: string;
  [key: string]: unknown;
}

const EVCatalogPage = () => {
  const [activeCatalog, setActiveCatalog] = useState<CatalogItem | null>(null);
  const [catalogs, setCatalogs] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const response = await fetch('https://aaj-tech-backend.onrender.com/api/ev-catalog/');
        const data = await response.json();
        setCatalogs(data);
        if (data.length > 0) {
          setActiveCatalog(data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch EV catalogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalogs();
  }, []);

  return (
    <div className="bg-white min-h-screen selection:bg-brand-red/20 overflow-x-hidden pt-20">
      {/* Header Section */}
      <section className="relative py-24 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-red rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-red rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-black tracking-[0.3em] uppercase mb-8"
            >
              <BookOpen size={14} className="text-brand-red" />
              Green Tech Library
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-8"
            >
              EV SOLUTION <br />
              <span className="text-brand-red">CATALOG</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 text-xl font-medium max-w-2xl leading-relaxed mx-auto md:mx-0"
            >
              Explore our electric vehicle charging connectors, battery pack wire harnesses, and smart power busbars in our interactive digital catalog.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Flipbook Section */}
      <section className="py-24 container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="w-12 h-12 text-brand-red animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading EV Catalogs...</p>
          </div>
        ) : activeCatalog ? (
          <div className="space-y-16">
            {/* Catalog Selector if more than one */}
            {catalogs.length > 1 && (
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {catalogs.map((cat) => (
                  <button
                    key={cat.url}
                    onClick={() => setActiveCatalog(cat)}
                    className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeCatalog.url === cat.url
                      ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            <div>
              <div className="bg-gray-50 rounded-[4rem] p-8 md:p-20 border border-gray-100 shadow-inner overflow-hidden">
                <Flipbook pdfUrl={activeCatalog.url.startsWith('http') ? activeCatalog.url : `https://aaj-tech-backend.onrender.com${activeCatalog.url}`} />
              </div>
            </div>

            <div className="flex justify-center">
              <a
                href={activeCatalog.url.startsWith('http') ? activeCatalog.url : `https://aaj-tech-backend.onrender.com${activeCatalog.url}`}
                download
                className="inline-flex items-center gap-4 bg-brand-dark text-white px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition-all uppercase tracking-widest"
              >
                Download PDF Version <Download size={24} />
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 max-w-4xl mx-auto bg-gray-50 rounded-[4rem] border border-gray-100 p-12 shadow-sm">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Book size={32} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-black text-brand-dark mb-4 uppercase tracking-tight">EV Catalog In Preparation</h3>
            <p className="text-gray-500 font-medium max-w-xl mx-auto mb-10 text-lg leading-relaxed">
              We are currently finalizing our dedicated Electric Vehicle connectivity catalog. In the meantime, you can download our complete corporate product catalog, or contact us to receive customized datasheets.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-3 bg-brand-dark text-white px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-red transition-all"
              >
                General Catalog <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 bg-white border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-light transition-all"
              >
                Request Custom Specs <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Support Section */}
      <section className="py-32 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <Reveal direction="up">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              NEED AUTOMOTIVE <br /> <span className="text-brand-red">COMPLIANCE DATA?</span>
            </h2>
            <p className="text-gray-400 text-xl font-medium mb-12 max-w-2xl mx-auto">
              Our engineering cell provides complete RoHS, REACH, CE, and UL validation reports for EV components on demand.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-4 bg-brand-red text-white px-16 py-7 rounded-full font-black text-xl shadow-[0_20px_50px_rgba(210,35,42,0.3)] hover:scale-110 transition-all duration-300 uppercase tracking-widest"
            >
              Contact Engineering <ArrowRight size={24} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Features Row */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: Shield,
                title: "AIS 156 Compliant",
                desc: "All battery-compartment wire harnesses are designed in accordance with battery safety regulations."
              },
              {
                icon: Zap,
                title: "Thermal Stability",
                desc: "EV cables rated for high temperature continuous operation from -40°C to +125°C."
              },
              {
                icon: Globe,
                title: "Global Charging Standards",
                desc: "Supports Type 1, Type 2, CCS2, and GB/T international charging connectors."
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-light rounded-[2rem] flex items-center justify-center text-brand-red mb-8">
                  <feature.icon size={32} />
                </div>
                <h4 className="text-xl font-black text-brand-dark mb-4 uppercase tracking-tight">{feature.title}</h4>
                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EVCatalogPage;
