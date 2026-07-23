'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowLeft } from 'lucide-react';

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
            <div className="pt-4">
              <Link
                href={`/contact?product=${encodeURIComponent(product.title)}`}
                className="w-full text-center bg-brand-red hover:bg-brand-dark text-white py-4 rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-brand-red/10 hover:shadow-brand-red/20 active:scale-95 transition-all text-center flex items-center justify-center cursor-pointer"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
