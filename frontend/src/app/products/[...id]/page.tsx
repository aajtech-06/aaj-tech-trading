import type { Metadata } from 'next';
import React from 'react';

import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Package, Truck, ShieldCheck } from 'lucide-react';
import ProductActions from '@/features/products/ProductActions';
import ProductAccordion from '@/features/products/components/ProductAccordion';

import { Product } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://aajtechtrading.in';
const API_BASE = `${BACKEND_URL}/api`;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const isObjectId = (str: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(str);
};

const isValidImageUrl = (url: string) => {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

interface ProductPageProps {
  params: Promise<{ id: string[] }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  let fetchUrl = '';
  if (idParam && idParam.length > 0) {
    if (idParam.length === 1) {
      fetchUrl = `${API_BASE}/products/${idParam[0]}`;
    } else if (idParam.length === 2) {
      fetchUrl = `${API_BASE}/products/slug/${idParam[1]}`;
    }
  }

  if (!fetchUrl) {
    return {};
  }

  try {
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) return {};
    const product: Product = await res.json();

    const title = `${product.name} | AAJ TECH TRADING`;
    const description = product.description || `Buy premium industrial components like ${product.name} at AAJ TECH TRADING.`;
    const imageUrl = product.image || "https://aajtechtrading.in/logo.png";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://aajtechtrading.in/products/${idParam.join('/')}`,
        siteName: 'AAJ TECH TRADING CORPORATION',
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (err) {
    console.error("Failed to generate product metadata", err);
    return {};
  }
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id: idParam } = await params;

  if (idParam && idParam.length === 1 && !isObjectId(idParam[0])) {
    const idVal = idParam[0];
    let catId = '';
    try {
      const catRes = await fetch(`${API_BASE}/categories/`, { cache: 'no-store' });
      if (catRes.ok) {
        const categories = await catRes.json();
        const cat = categories.find((c: { id: string; name: string }) => slugify(c.name) === idVal);
        if (cat) {
          catId = cat.id;
        }
      }
    } catch (err) {
      console.error("Failed to fetch categories during redirect", err);
    }
    if (catId) {
      redirect(`/products?category=${catId}`);
    } else {
      notFound();
    }
  }

  let product: Product | null = null;
  let categoryName = 'Uncategorized';

  try {
    let fetchUrl = '';
    if (idParam && idParam.length > 0) {
      if (idParam.length === 1) {
        fetchUrl = `${API_BASE}/products/${idParam[0]}`;
      } else if (idParam.length === 2) {
        fetchUrl = `${API_BASE}/products/slug/${idParam[1]}`;
      }
    }

    if (!fetchUrl) {
      notFound();
    }

    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) {
      notFound();
    }
    product = await res.json();

    if (product && product.category_id) {
      const catRes = await fetch(`${API_BASE}/categories/`, { cache: 'no-store' });
      if (catRes.ok) {
        const categories = await catRes.json();
        const cat = categories.find((c: { id: string; name: string }) => c.id === product?.category_id);
        if (cat) categoryName = cat.name;
      }
    }
  } catch (error) {
    console.error("Failed to fetch product", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const basePrice = product.price || 450;
  const gstAmount = basePrice * 0.18;
  const finalPrice = basePrice + gstAmount;

  return (
    <div className="pt-32 pb-24 bg-[#FAFAFA] dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red mb-12 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="relative h-[400px] md:h-[600px] rounded-[48px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-white dark:border-neutral-800 flex items-center justify-center bg-white dark:bg-neutral-900 p-8">
              {product.isUlApproved && (
                <span
                  className="absolute bg-[#16A34A] text-white shadow-sm"
                  style={{
                    top: '24px',
                    left: '24px',
                    zIndex: 10,
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '6px 12px',
                  }}
                >
                  UL APPROVED
                </span>
              )}
              {isValidImageUrl(product.image) ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain p-8 hover:scale-105 transition-transform duration-700"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <Package size={64} className="text-gray-200 dark:text-gray-700" />
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Image Available</span>
                </div>
              )}
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white dark:bg-neutral-900 px-6 py-4 rounded-3xl border border-gray-100 dark:border-neutral-800 flex items-center gap-3 shadow-sm">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Certified Quality</span>
              </div>
              <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <Truck className="text-blue-500" size={20} />
                <span className="text-sm font-bold text-gray-700">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl">
                {categoryName}
              </span>
              {product.sku && (
                <span className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl">
                  SKU: {product.sku}
                </span>
              )}
              {product.isUlApproved && (
                <span className="bg-[#16A34A] text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl shadow-sm">
                  UL Approved
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark dark:text-white mb-6 leading-[1.1]">
              {product.name}
            </h1>

            {/* Availability & MOQ Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                In Stock
              </div>
              <div className="bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-gray-200/50 dark:border-neutral-700">
                MOQ: {product.moq || '10 PCS'}
              </div>
            </div>

            {/* Certification Details */}
            {product.isUlApproved && (
              <div className="mb-6 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Certification</span>
                <span className="text-sm font-black text-brand-dark dark:text-white flex items-center gap-1.5">
                  <span className="text-emerald-500 font-bold">✅</span> UL Approved
                </span>
              </div>
            )}

            {/* Price Box */}
            <div className="w-full max-w-md bg-[#F4FBF7] dark:bg-emerald-950/20 border border-[#E6F4EA] dark:border-emerald-900/40 rounded-3xl p-6 mb-10 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-900 dark:text-gray-100 font-extrabold text-base">Base Price:</span>
                <span className="text-3xl font-black text-[#007A53] dark:text-emerald-400">
                  ₹{basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">GST 18%:</span>
                <span className="text-base font-bold text-gray-700 dark:text-gray-300">
                  ₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="border-t border-[#D0F0DB] dark:border-emerald-900/40 my-4" />
              <div className="flex justify-between items-center flex-wrap gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">Final Price (Inclusive of all taxes):</span>
                <span className="text-xl font-black text-gray-900 dark:text-white">
                  ₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {(product.unit || 'pcs').toUpperCase()}
                </span>
              </div>
              </div>
            {/* Features List */}
            <div className="mb-12">
              <h3 className="font-black text-brand-dark dark:text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-brand-red" />
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 group">
                      <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <CheckCircle2 size={14} />
                      </div>
                      <span className="text-gray-700 font-semibold text-sm">{feature}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic text-sm">Standard specifications apply.</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <ProductActions
                id={product.id}
                price={basePrice}
                productName={product.name}
                productImage={product.image}
                productCategory={categoryName}
                moq={product.moq}
                productUnit={product.unit}
              />
            </div>
          </div>
        </div>

        {/* Collapsible Accordion Sections */}
        <div className="mb-24">
          <ProductAccordion 
            specifications={product.specifications} 
            description={product.description}
            datasheet={product.datasheet}
          />
        </div>

        {/* Value Proposition */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Package, title: 'Secure Packaging', desc: 'Industrial-grade protection for safe transit.' },
            { icon: Truck, title: 'Global Logistics', desc: 'Fast and reliable worldwide shipping network.' },
            { icon: ShieldCheck, title: 'Full Warranty', desc: 'Comprehensive coverage for all components.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:border-brand-red/20 transition-colors">
              <div className="w-16 h-16 rounded-3xl bg-brand-light text-brand-red flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon size={32} />
              </div>
              <h4 className="font-black text-brand-dark mb-3 uppercase tracking-wider text-sm">{item.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
