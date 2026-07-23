'use client';

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import React, { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Search, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

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

const WireHarnessProductsContent = () => {
  const [products, setProducts] = useState<HarnessProduct[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; voltageType: string }[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { addToCart, setCheckoutStep, setIsOpen } = useCart();
  
  // Navigation & Category Tab state
  const [selectedVoltageType, setSelectedVoltageType] = useState('Low Voltage Harness');
  const [selectedCategory, setSelectedCategory] = useState('Electronic & Communication Harness');

  const handleAddToCart = (e: React.MouseEvent, product: HarnessProduct) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.title,
      price: 0,
      image: product.image,
      category: product.subcategory || 'Wire Harness',
      moq: '100 PCS',
      unit: 'pcs'
    }, 100);

    setCheckoutStep('cart');
    setIsOpen(true);
  };
  
  const [searchQuery, setSearchQuery] = useState('');



  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://aajtechtrading.in/api/harness/');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching harness products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://aajtechtrading.in/api/harness/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Dynamically resolve low and high voltage category lists
  const lowCats = categories
    .filter((c) => c.voltageType === 'Low Voltage Harness')
    .map((c) => c.name);

  const highCats = categories
    .filter((c) => c.voltageType === 'High Voltage Harness')
    .map((c) => c.name);

  const lowVoltageCategories = lowCats.length > 0 ? lowCats : [
    'Electronic & Communication Harness',
    'Automotive Harness',
    'Industrial Harness',
    'Medical Harness',
    'Telecom Harness',
  ];

  const highVoltageCategories = highCats.length > 0 ? highCats : [
    'Solar Harness',
    'Battery Charging Harness',
    'EV Harness',
    'Energy Storage Harness',
    'Industrial High Voltage Harness',
  ];

  const categoriesOrder: { [key: string]: string[] } = {
    'Low Voltage Harness': lowVoltageCategories,
    'High Voltage Harness': highVoltageCategories,
  };

  useEffect(() => {
    const activeList = categoriesOrder[selectedVoltageType] || [];
    if (activeList.length > 0 && !activeList.includes(selectedCategory)) {
      setSelectedCategory(activeList[0]);
    }
  }, [categories, selectedVoltageType]);

  const handleVoltageTypeChange = (type: string) => {
    setSelectedVoltageType(type);
    const list = categoriesOrder[type] || [];
    setSelectedCategory(list[0] || '');
    // Reset filters when switching voltage tabs
    setSearchQuery('');
  };

  // Client-Side Filter Implementation
  const filteredProducts = products.filter((product) => {
    // 1. Voltage Type Check (backward compatible)
    const vType = product.voltageType || 'Low Voltage Harness';
    if (vType !== selectedVoltageType) return false;

    // 2. Category Check (backward compatible)
    const subCat = product.subcategory || 'General Assemblies';
    // Fallback: If category is General Assemblies, put under the first subcategory or let it match
    if (selectedCategory !== 'General Assemblies' && selectedCategory !== subCat) {
      // If product has no subcategory, allow it under the first Category tab for backward compatibility
      const currentVoltageCategories = categoriesOrder[selectedVoltageType] || [];
      const isFirstCat = currentVoltageCategories[0] === selectedCategory;
      if (!(isFirstCat && subCat === 'General Assemblies')) {
        return false;
      }
    }

    // 3. Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const title = (product.title || '').toLowerCase();
      const details = (product.details || '').toLowerCase();
      const spacing = (product.spacing || '').toLowerCase();
      const bottomPlateType = (product.bottomPlateType || '').toLowerCase();
      const pinQuantity = (product.pinQuantity || '').toLowerCase();
      const productStatus = (product.productStatus || '').toLowerCase();
      if (
        !title.includes(q) &&
        !details.includes(q) &&
        !spacing.includes(q) &&
        !bottomPlateType.includes(q) &&
        !pinQuantity.includes(q) &&
        !productStatus.includes(q)
      ) {
        return false;
      }
    }

    return true;
  });



  return (
    <div className="bg-white dark:bg-brand-dark min-h-screen transition-colors duration-300">
      {/* Banner Section */}
      <section className="relative bg-brand-red pt-40 pb-24 overflow-hidden mt-16 lg:mt-0">
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-30 pointer-events-none">
          <Image
            src="/Wire to board Assemblies.webp"
            alt="Wire Harness Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-red via-brand-red/80 to-transparent" />
        </div>
        <div className="w-full px-6 md:px-16 lg:px-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tight">Products</h1>
            <div className="flex items-center gap-2 text-white/80 font-bold text-xs md:text-sm tracking-widest uppercase flex-wrap">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <Link href="/about-wire-harness" className="hover:text-white transition-colors">Wire Harness</Link>
              <ChevronRight size={14} />
              <span className="text-white">Products</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="relative py-16 bg-white dark:bg-brand-dark z-20 transition-colors duration-300">
        <div className="w-full px-6 md:px-16 lg:px-24 space-y-12">
          
          {/* STEP 1: Voltage Type Tabs */}
          <div className="flex border-b border-gray-200 dark:border-neutral-800">
            <button
              onClick={() => handleVoltageTypeChange('Low Voltage Harness')}
              className={`flex-1 text-center py-5 font-black text-sm md:text-lg uppercase tracking-widest border-b-4 transition-all ${
                selectedVoltageType === 'Low Voltage Harness'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-400 hover:text-brand-dark dark:hover:text-white'
              }`}
            >
              Low Voltage Harness
            </button>
            <button
              onClick={() => handleVoltageTypeChange('High Voltage Harness')}
              className={`flex-1 text-center py-5 font-black text-sm md:text-lg uppercase tracking-widest border-b-4 transition-all ${
                selectedVoltageType === 'High Voltage Harness'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-400 hover:text-brand-dark dark:hover:text-white'
              }`}
            >
              High Voltage Harness
            </button>
          </div>

          {/* STEP 2: Category Pills */}
          <div className="flex gap-2.5 overflow-x-auto py-2 scrollbar-none border-b border-gray-50 dark:border-neutral-900 pb-6">
            {(categoriesOrder[selectedVoltageType] || []).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-full font-bold text-xs shrink-0 transition-all uppercase tracking-wider border ${
                  selectedCategory === cat
                    ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/10'
                    : 'bg-gray-50 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-neutral-800 hover:border-brand-red hover:text-brand-red'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Catalog Main Layout */}
          <div className="w-full">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900 rounded-[40px] border border-gray-100 dark:border-neutral-800">
                <Search size={48} className="mx-auto text-gray-300 dark:text-neutral-700 mb-4 animate-bounce" />
                <h3 className="text-xl font-black text-brand-dark dark:text-white mb-2">No Products Found</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">Please check back later or try selecting another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-[32px] p-6 hover:shadow-xl hover:border-brand-red/20 transition-all flex flex-col group relative"
                  >
                    {/* Image Area */}
                    <div className="aspect-square bg-gray-50 dark:bg-neutral-955 rounded-2xl overflow-hidden relative p-4 flex items-center justify-center mb-6 border border-gray-50 dark:border-neutral-900">
                      <Image
                        src={product.image?.startsWith('http') ? product.image : (product.image?.startsWith('/uploads/') ? `https://aajtechtrading.in${product.image}` : (product.image || "/Wire to board Assemblies.webp"))}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-contain p-4 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 flex flex-col space-y-3">
                      <h4 className="font-black text-brand-dark dark:text-white text-md line-clamp-1 group-hover:text-brand-red transition-colors">
                        {product.title}
                      </h4>
                      
                      {product.details && (
                        <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                          {product.details}
                        </p>
                      )}

                      {product.spacing && (
                        <div className="text-[11px] font-bold text-gray-500">
                          <span className="text-brand-dark dark:text-white">Spacing: </span>
                          <span className="font-medium line-clamp-1">{product.spacing}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50 dark:border-neutral-800">
                        {product.productStatus ? (
                          <span className="inline-block text-[9px] font-black uppercase tracking-widest text-brand-red w-max bg-brand-red/5 px-2 py-0.5 rounded">
                            {product.productStatus}
                          </span>
                        ) : (
                          <div />
                        )}

                        <Link
                          href={`/wire-harness-products/${product.id}`}
                          className="flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-dark dark:hover:text-white transition-colors group/link"
                        >
                          View Details
                          <ArrowRight size={14} className="transform group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="w-full bg-brand-red hover:bg-brand-dark text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group/btn"
                      >
                        <ShoppingCart size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


    </div>
  );
};

const WireHarnessProductsPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20 min-h-screen items-center">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <WireHarnessProductsContent />
    </Suspense>
  );
};

export default WireHarnessProductsPage;
