'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/utils';

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

interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image: string;
}

interface Category {
  id: string;
  name: string;
}

const ProductsContent = () => {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/products/`),
          fetch(`${API_BASE}/categories/`)
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData);
        setCategories(catData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategorySelect = (catId: string) => {
    if (selectedCategory === catId) return;
    setIsFiltering(true);
    setSelectedCategory(catId);
    setCurrentPage(1);
    setTimeout(() => {
      setIsFiltering(false);
    }, 400);
  };

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCategory(category);
    } else {
      setSelectedCategory('all');
    }

    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }

    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-light">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark mb-4">Our Product <span className="text-brand-red">Catalog</span></h1>
          <p className="text-gray-600">Browse through our comprehensive range of high-performance industrial components.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:sticky lg:top-32 space-y-8 h-fit lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto pr-4">
            {/* Search */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-brand-dark mb-4">Search Products</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Product name..."
                  className="w-full pl-10 pr-4 py-3 bg-brand-light border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-red transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-brand-dark mb-6">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all break-words whitespace-normal",
                    selectedCategory === 'all' ? "bg-brand-red text-white" : "hover:bg-brand-light text-gray-600"
                  )}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all break-words whitespace-normal",
                      selectedCategory === cat.id ? "bg-brand-red text-white" : "hover:bg-brand-light text-gray-600"
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {(loading || isFiltering) ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 size={48} className="animate-spin text-brand-red" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {currentProducts.map((product, index) => {
                    const category = categories.find(c => c.id === product.category_id);
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                      >
                        <div className="relative h-64 overflow-hidden bg-brand-light flex items-center justify-center">
                          {isValidImageUrl(product.image) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Image</span>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm text-brand-red text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                              {category ? category.name : 'Uncategorized'}
                            </span>
                          </div>
                        </div>
                        <div className="p-8">
                          <h3 className="text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-red transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[40px]">
                            {product.description || 'No description available.'}
                          </p>
                          <Link
                            href={`/products/${product.id}`}
                            className="w-full flex items-center justify-between bg-brand-light hover:bg-brand-red hover:text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all group/btn"
                          >
                            View Details
                            <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                  <div className="mt-16 flex flex-col items-center gap-8">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white text-gray-400 border border-gray-100 shadow-sm hover:border-brand-red hover:text-brand-red transition-all disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={cn(
                              "w-14 h-14 rounded-2xl font-black text-sm transition-all",
                              currentPage === pageNum
                                ? "bg-brand-red text-white shadow-xl shadow-brand-red/20"
                                : "bg-white text-gray-400 border border-gray-100 hover:border-brand-red hover:text-brand-red shadow-sm"
                            )}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white text-gray-400 border border-gray-100 shadow-sm hover:border-brand-red hover:text-brand-red transition-all disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>

                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                      Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} Products
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                <Search size={48} className="text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-brand-dark mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or category filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-brand-light">
        <Loader2 size={48} className="animate-spin text-brand-red" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
};

export default ProductsPage;
