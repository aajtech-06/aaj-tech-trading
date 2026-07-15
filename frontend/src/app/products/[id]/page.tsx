import React from 'react';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Package, Truck, ShieldCheck } from 'lucide-react';
import ProductActions from '@/features/products/ProductActions';
import ProductSpecifications from '@/features/products/components/ProductSpecifications';

import { Product } from '@/types';

const API_BASE = 'https://aaj-tech-backend.onrender.com/api';

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
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { id } = await params;

  let product: Product | null = null;
  let categoryName = 'Uncategorized';

  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
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

  return (
    <div className="pt-32 pb-24 bg-[#FAFAFA]">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-red mb-12 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24 mb-24">
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="relative h-[400px] md:h-[600px] rounded-[48px] overflow-hidden shadow-2xl shadow-gray-200/50 border border-white flex items-center justify-center bg-white p-8">
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
                  <Package size={64} className="text-gray-200" />
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Image Available</span>
                </div>
              )}
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="text-sm font-bold text-gray-700">Certified Quality</span>
              </div>
              <div className="bg-white px-6 py-4 rounded-3xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <Truck className="text-blue-500" size={20} />
                <span className="text-sm font-bold text-gray-700">Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-brand-red/10 text-brand-red text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl">
                {categoryName}
              </span>
              {product.sku && (
                <span className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl">
                  SKU: {product.sku}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-dark mb-6 leading-[1.1]">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-10 bg-white self-start px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Starting From</span>
                <span className="text-3xl font-black text-brand-red">₹{product.price || 450}</span>
              </div>
              <div className="w-px h-10 bg-gray-100 mx-2" />
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Availability</span>
                <span className="text-sm font-extrabold text-emerald-600 uppercase tracking-wider">In Stock</span>
              </div>
            </div>

            <p className="text-gray-600 text-lg mb-12 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Features List */}
            <div className="mb-12">
              <h3 className="font-black text-brand-dark text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
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
                price={product.price || 450}
                productName={product.name}
                productImage={product.image}
                productCategory={categoryName}
              />
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="mb-24">
          <ProductSpecifications specifications={product.specifications} />
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
