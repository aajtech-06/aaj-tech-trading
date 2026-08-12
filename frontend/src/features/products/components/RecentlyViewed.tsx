'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, Heart, Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';
import { useCart } from '@/context/CartContext';

const API_BASE = 'https://aajtechtrading.in/api';

interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image: string;
  price?: number;
  sku?: string;
  specifications?: Record<string, any>;
  moq?: string;
  unit?: string;
  isUlApproved?: boolean;
  hasVariantPricing?: boolean;
  variants?: any[];
  variantType?: string;
  customSpecifications?: Record<string, any>;
}

interface Category {
  id: string;
  name: string;
}

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

// Mini Card Component replicating the exact design of ProductCard in products/page.tsx
const RecentlyViewedCard = ({
  product,
  category
}: {
  product: Product;
  category: Category | undefined;
}) => {
  const [liked, setLiked] = useState(false);
  const { addToCart, setIsOpen, setCheckoutStep } = useCart();

  const categoryName = category ? category.name : 'uncategorized';
  const categorySlug = slugify(categoryName);
  const productSlug = slugify(product.name);
  let suffix = '';
  try {
    suffix = (BigInt('0x' + product.id) % BigInt(10000000)).toString().padStart(7, '0');
  } catch (err) {
    console.error('Error generating product URL suffix:', err);
  }
  const productUrl = suffix 
    ? `/products/${categorySlug}/${productSlug}-${suffix}`
    : `/products/${product.id}`;

  const defaultVariantIdx = product.hasVariantPricing && product.variants && product.variants.length > 0
    ? Math.max(0, product.variants.findIndex(v => v.isDefault && v.status === 'active'))
    : 0;

  const [selectedVarIdx, setSelectedVarIdx] = useState(defaultVariantIdx);

  const activeVariant = product.hasVariantPricing && product.variants && product.variants.length > 0
    ? product.variants[selectedVarIdx]
    : null;

  const displayPrice = activeVariant ? activeVariant.price : (product.price !== undefined && product.price !== null) ? product.price : null;
  const displayUnit = activeVariant ? activeVariant.unit : (product.unit || 'pcs');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const moqText = product.moq || product.specifications?.moq || product.specifications?.MOQ || '200 PCS';
    const moqNumber = parseInt(moqText.replace(/\D/g, '')) || 1;

    if (product.hasVariantPricing && activeVariant) {
      addToCart({
        id: product.id,
        name: `${product.name} (${activeVariant.label})`,
        price: activeVariant.price,
        image: product.image,
        category: category?.name || 'Connector',
        moq: moqText,
        unit: activeVariant.unit,
        size: activeVariant.label,
        cartId: `${product.id}-${activeVariant.id}`
      }, moqNumber);
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: (product.price !== undefined && product.price !== null) ? product.price : 0,
        image: product.image,
        category: category?.name || 'Connector',
        moq: moqText,
        unit: product.unit || 'pcs'
      }, moqNumber);
    }

    setCheckoutStep('cart');
    setIsOpen(true);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[24px] overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-50/50 dark:bg-neutral-850 flex items-center justify-center border-b border-gray-100/60 dark:border-neutral-800">
        {product.isUlApproved && (
          <span
            className="absolute bg-[#16A34A] text-white shadow-sm"
            style={{
              top: '12px',
              left: '12px',
              zIndex: 10,
              borderRadius: '999px',
              fontSize: '10px',
              fontWeight: 600,
              padding: '4px 8px',
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
            className="max-h-[80%] max-w-[80%] object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No Image</span>
        )}

        {/* Heart/Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-gray-100 dark:border-neutral-700 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-10 cursor-pointer"
        >
          <Heart
            size={14}
            className={cn(
              "transition-colors duration-300",
              liked ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"
            )}
          />
        </button>
      </div>

      {/* Info Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <span className="text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider mb-1 block">
          {category ? category.name : 'Uncategorized'}
        </span>

        {/* Product Title */}
        <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-brand-red dark:group-hover:text-brand-red transition-colors min-h-[32px] uppercase">
          {product.name}
        </h3>

        {/* SKU */}
        {product.sku && (
          <p className="text-gray-400 dark:text-neutral-500 text-[9px] font-bold mb-1">
            SKU: {product.sku}
          </p>
        )}

        {/* MOQ */}
        <p className="text-gray-550 dark:text-gray-400 text-[10px] font-semibold mb-1">
          MOQ: {product.moq || product.specifications?.moq || product.specifications?.MOQ || '200 PCS'}
        </p>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Variant Dropdown Selector (Conditional) */}
        {product.hasVariantPricing && product.variants && product.variants.length > 0 && (
          <div className="mt-1 mb-2">
            <label className="text-[8px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest block mb-0.5">
              Select Option
            </label>
            <div className="relative">
              <select
                value={selectedVarIdx}
                onChange={(e) => setSelectedVarIdx(parseInt(e.target.value))}
                className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg py-1.5 px-2.5 font-bold text-brand-dark dark:text-white focus:ring-1 focus:ring-brand-red outline-none appearance-none cursor-pointer text-[10px] transition-all pr-6"
              >
                {product.variants.map((v, idx) => (
                  <option key={v.id || idx} value={idx} disabled={v.status === 'inactive'}>
                    {v.label} - ₹{v.price} {v.stock <= 0 ? ' [OOS]' : ''}
                  </option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-[8px] pointer-events-none">▼</span>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-neutral-800 my-2" />

        {/* Bottom Section: Price & View Details */}
        <div className="flex items-end justify-between">
          {displayPrice !== null ? (
            <div className="flex flex-col">
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Price</span>
              <span className="text-sm font-black text-brand-dark dark:text-white">
                ₹{displayPrice.toLocaleString('en-IN')}.00 <span className="text-gray-400 text-[8px] font-normal">/ {displayUnit || 'pcs'}</span>
              </span>
            </div>
          ) : (
            <div className="flex-grow" />
          )}

          <Link
            href={productUrl}
            className="flex items-center gap-0.5 text-[10px] font-bold text-brand-red hover:text-brand-dark dark:hover:text-white transition-colors group/link pb-0.5"
          >
            View
            <ArrowRight size={10} className="transform group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-brand-red hover:bg-brand-dark text-white py-2 rounded-lg font-bold text-xs transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 group/btn"
        >
          <ShoppingCart size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

interface RecentlyViewedProps {
  currentProductId: string;
}

export default function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize and update history
  useEffect(() => {
    const saved = localStorage.getItem('aaj_recently_viewed');
    let ids: string[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          ids = parsed.filter(Boolean);
        }
      } catch (e) {
        console.error('Failed to parse recently viewed history', e);
      }
    }

    // Filter out current product if already exists, then add to top
    const updatedIds = [currentProductId, ...ids.filter(id => id !== currentProductId)].slice(0, 6);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistoryIds(updatedIds);
    localStorage.setItem('aaj_recently_viewed', JSON.stringify(updatedIds));
  }, [currentProductId]);

  // Fetch product information
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch(`${API_BASE}/products/`),
          fetch(`${API_BASE}/categories/`)
        ]);
        if (prodRes.ok && catRes.ok) {
          const prodData = await prodRes.json();
          const catData = await catRes.json();
          setProducts(prodData);
          setCategories(catData);
        }
      } catch (error) {
        console.error('Failed to fetch recently viewed details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter list of valid products corresponding to history ids (excluding the current viewed one)
  const historyProducts = useMemo(() => {
    if (loading || products.length === 0) return [];

    const validProds = historyIds
      .filter(id => id !== currentProductId) // Exclude currently viewed product
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => !!p);
      
    // Sync back to localStorage if any product no longer exists in DB
    if (validProds.length < historyIds.filter(id => id !== currentProductId).length) {
      const activeIds = [currentProductId, ...validProds.map(p => p.id)];
      localStorage.setItem('aaj_recently_viewed', JSON.stringify(activeIds));
    }

    return validProds;
  }, [historyIds, products, currentProductId, loading]);

  const handleClearAll = () => {
    localStorage.removeItem('aaj_recently_viewed');
    setHistoryIds([]);
  };

  if (loading) {
    return (
      <div className="py-12 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-brand-red mr-2" />
        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading recently viewed...</span>
      </div>
    );
  }

  if (historyProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-16 border-t border-gray-150 dark:border-neutral-800/60 mt-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-brand-dark dark:text-white uppercase tracking-tight">
            Recently Viewed Products
          </h2>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            Your browsing history
          </p>
        </div>
        
        <button
          onClick={handleClearAll}
          className="text-xs font-bold text-gray-500 hover:text-brand-red transition-colors uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer border-none bg-transparent"
        >
          Clear All
        </button>
      </div>

      {/* Grid container with horizontal scroll support on mobile */}
      <div className="overflow-x-auto w-full pb-4 scrollbar-thin">
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-5 gap-6 min-w-[700px] md:min-w-0">
          {historyProducts.map(product => {
            const category = categories.find(c => c.id === product.category_id);
            return (
              <div key={product.id} className="w-[240px] md:w-auto flex-shrink-0 md:flex-shrink-1">
                <RecentlyViewedCard product={product} category={category} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
