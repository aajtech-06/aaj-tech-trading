'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Loader2, ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useCart } from '@/context/CartContext';

const API_BASE = 'https://aajtechtrading.in/api';

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
  price?: number;
  specifications?: Record<string, any>;
  moq?: string;
  unit?: string;
  isUlApproved?: boolean;
}

interface Category {
  id: string;
  name: string;
}

const ProductCard = ({
  product,
  category
}: {
  product: Product;
  category: Category | undefined;
}) => {
  const [liked, setLiked] = useState(false);
  const { addToCart, setIsOpen, setCheckoutStep } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const moqText = product.moq || product.specifications?.moq || product.specifications?.MOQ || '200 PCS';
    const moqNumber = parseInt(moqText.replace(/\D/g, '')) || 1;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price || 450,
      image: product.image,
      category: category?.name || 'Connector',
      moq: moqText,
      unit: product.unit || 'pcs'
    }, moqNumber);

    setCheckoutStep('cart');
    setIsOpen(true);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[24px] overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      {/* Image Container with White/Light Gray background */}
      <div className="relative h-56 overflow-hidden bg-gray-50/50 dark:bg-neutral-800/40 flex items-center justify-center border-b border-gray-100/60 dark:border-neutral-800">
        {product.isUlApproved && (
          <span
            className="absolute bg-[#16A34A] text-white shadow-sm animate-fade-in"
            style={{
              top: '12px',
              left: '12px',
              zIndex: 10,
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              padding: '5px 10px',
            }}
          >
            UL APPROVED
          </span>
        )}
        {isValidImageUrl(product.image) ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">No Image</span>
        )}

        {/* Heart/Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
        >
          <Heart
            size={18}
            className={cn(
              "transition-colors duration-300",
              liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
            )}
          />
        </button>
      </div>

      {/* Info Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category (Vibrant Blue) */}
        <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1 block">
          {category ? category.name : 'Uncategorized'}
        </span>

        {/* Product Title */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors">
          {product.name}
        </h3>

        {/* MOQ (Minimum Order Quantity) */}
        <p className="text-gray-500 dark:text-gray-400 text-[11px] font-semibold mb-1">
          MOQ: {product.moq || product.specifications?.moq || product.specifications?.MOQ || '200 PCS'}
        </p>

        {/* Short Description */}
        <p className="text-gray-400 dark:text-gray-400 text-xs mb-3 line-clamp-2">
          {product.description || 'No description available.'}
        </p>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-neutral-800 my-3" />

        {/* Bottom Section: Price & View Details */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Starting From</span>
            <span className="text-lg font-black text-brand-dark dark:text-white">
              ₹{(product.price || 450).toLocaleString('en-IN')}.00 <span className="text-gray-400 text-[10px] font-normal">/ {product.unit || 'pcs'}</span>
            </span>
          </div>

          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-dark dark:hover:text-white transition-colors group/link pb-1"
          >
            View Details
            <ArrowRight size={14} className="transform group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-brand-red hover:bg-brand-dark text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

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
    <div className="pt-32 pb-24 min-h-screen bg-brand-light dark:bg-brand-dark transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white mb-4">Our Product <span className="text-brand-red">Catalog</span></h1>
          <p className="text-gray-600 dark:text-gray-400">Browse through our comprehensive range of high-performance industrial components.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:sticky lg:top-32 space-y-8 h-fit lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto pr-4">
            {/* Search */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800">
              <h3 className="font-bold text-brand-dark dark:text-white mb-4">Search Products</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Product name..."
                  className="w-full pl-10 pr-4 py-3 bg-brand-light dark:bg-neutral-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-red dark:text-white transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-neutral-800">
              <h3 className="font-bold text-brand-dark dark:text-white mb-6">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all break-words whitespace-normal cursor-pointer",
                    selectedCategory === 'all' ? "bg-brand-red text-white" : "hover:bg-brand-light dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300"
                  )}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all break-words whitespace-normal cursor-pointer",
                      selectedCategory === cat.id ? "bg-brand-red text-white" : "hover:bg-brand-light dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-300"
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
                      >
                        <ProductCard product={product} category={category} />
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
