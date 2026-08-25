'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft, ClipboardList } from 'lucide-react';
import HarnessInquiryModal from '@/components/common/HarnessInquiryModal';

interface HarnessProduct {
  id: string;
  title: string;
  details: string;
  image: string;
  voltageType?: string;
  subcategory?: string;
  spacing?: string;
  bottomPlateType?: string;
  pinQuantity?: string;
  productStatus?: string;
  galleryImages?: string[];
}

export default function WireHarnessProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<HarnessProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const handleWhatsAppEnquiry = () => {
    if (!product) return;
    const phoneNumber = '9910009227';
    const message = `Hi, I am interested in ${product.title}.\nPlease share price and availability.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://aajtechtrading.in/api/harness/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setActiveImage(data.image);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching harness product details:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-brand-dark">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-brand-dark px-4 text-center">
        <h2 className="text-3xl font-black text-brand-dark dark:text-white mb-4">Product Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-sm">The wire harness product you are looking for does not exist or has been deleted.</p>
        <button
          onClick={() => router.push('/wire-harness-products')}
          className="bg-brand-red hover:bg-brand-dark text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all cursor-pointer"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  // Gallery list helper
  const allImages = [product.image, ...(product.galleryImages || [])].filter(Boolean);

  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen pb-24 transition-colors duration-300">
      
      {/* Banner Section */}
      <section className="relative bg-brand-red pt-36 pb-16 overflow-hidden mt-16 lg:mt-0">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-20 pointer-events-none">
          <Image
            src={product.image?.startsWith('http') ? product.image : (product.image?.startsWith('/uploads/') ? `https://aajtechtrading.in${product.image}` : (product.image || "/Wire to board Assemblies.webp"))}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-red/90 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <button
              onClick={() => router.push('/wire-harness-products')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-xs uppercase tracking-wider transition-all bg-white/10 px-4 py-2.5 rounded-xl backdrop-blur-sm cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Catalog
            </button>

            <div className="flex items-center gap-2 text-white/60 font-bold text-xs tracking-widest uppercase flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/wire-harness-products" className="hover:text-white transition-colors">Wire Harness</Link>
              <ChevronRight size={12} />
              <span className="text-white">{product.title}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main product presentation */}
      <section className="container mx-auto px-4 max-w-7xl mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative aspect-square w-full rounded-[40px] overflow-hidden bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center p-8 group">
              <Image
                src={activeImage?.startsWith('http') ? activeImage : (activeImage?.startsWith('/uploads/') ? `https://aajtechtrading.in${activeImage}` : (activeImage || "/Wire to board Assemblies.webp"))}
                alt={product.title}
                fill
                sizes="(max-width: 1023px) 100vw, 624px"
                unoptimized
                className="object-contain p-6 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Gallery Thumbnails Selector */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2 max-w-full scrollbar-thin">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 dark:bg-neutral-900 border p-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === img
                        ? 'border-brand-red ring-4 ring-brand-red/10 scale-95'
                        : 'border-gray-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img?.startsWith('http') ? img : (img?.startsWith('/uploads/') ? `https://aajtechtrading.in${img}` : (img || "/Wire to board Assemblies.webp"))}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Specs summary and CTA */}
          <div className="lg:col-span-6 space-y-8 flex flex-col justify-start">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2.5">
                {product.voltageType && (
                  <span className="bg-brand-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-sm">
                    {product.voltageType}
                  </span>
                )}
                {product.subcategory && (
                  <span className="bg-brand-red/5 text-brand-red dark:bg-brand-red/10 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-brand-red/10">
                    {product.subcategory}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-brand-dark dark:text-white uppercase tracking-tight leading-tight">
                {product.title}
              </h1>
            </div>

            {/* Description details */}
            {product.details && (
              <div className="space-y-3 bg-gray-50 dark:bg-neutral-900 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800/80">
                <h4 className="text-[10px] font-black text-brand-red uppercase tracking-widest">
                  Product Description
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-semibold leading-relaxed">
                  {product.details}
                </p>
              </div>
            )}

            {/* Technical Specifications Table */}
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-neutral-800 overflow-hidden shadow-sm">
              <div className="bg-brand-red px-6 py-4">
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">
                  Technical Specifications
                </h4>
              </div>
              <div className="divide-y divide-gray-150 dark:divide-neutral-800">
                <div className="grid grid-cols-2 px-6 py-4 text-xs font-semibold">
                  <div className="font-black text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Spacing</div>
                  <div className="font-bold text-brand-dark dark:text-white">{product.spacing || '-'}</div>
                </div>
                <div className="grid grid-cols-2 px-6 py-4 text-xs font-semibold">
                  <div className="font-black text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Bottom Plate Type</div>
                  <div className="font-bold text-brand-dark dark:text-white">{product.bottomPlateType || '-'}</div>
                </div>
                <div className="grid grid-cols-2 px-6 py-4 text-xs font-semibold">
                  <div className="font-black text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Pin Quantity</div>
                  <div className="font-bold text-brand-dark dark:text-white">{product.pinQuantity || '-'}</div>
                </div>
                <div className="grid grid-cols-2 px-6 py-4 text-xs font-semibold">
                  <div className="font-black text-gray-400 dark:text-neutral-500 uppercase tracking-wider">Product Status</div>
                  <div className="font-bold text-brand-dark dark:text-white">{product.productStatus || 'Normal production'}</div>
                </div>
              </div>
            </div>

            {/* Dynamic CTA row */}
            <div className="pt-4 flex flex-col gap-3">
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="w-full text-center bg-brand-red hover:bg-brand-dark text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-brand-red/10 hover:shadow-brand-red/20 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer gap-2"
              >
                <ClipboardList size={16} />
                Order Inquiry
              </button>

              <button
                onClick={handleWhatsAppEnquiry}
                className="w-full text-center bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                🟢 ENQUIRE ON WHATSAPP
              </button>
            </div>
          </div>
        </div>
      </section>

      <HarnessInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        product={product}
      />
    </div>
  );
}
