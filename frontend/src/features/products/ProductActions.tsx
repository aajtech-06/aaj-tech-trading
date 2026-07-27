'use client';

import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { Variant } from '@/types';

interface ProductActionsProps {
  id: string;
  price: number;
  productName: string;
  productImage?: string;
  productCategory?: string;
  moq?: string;
  productUnit?: string;
  hasVariantPricing?: boolean;
  variants?: Variant[];
  variantType?: string;
}

const ProductActions = ({
  id,
  price,
  productName,
  productImage,
  productCategory,
  moq,
  productUnit = 'pcs',
  hasVariantPricing = false,
  variants = [],
  variantType = 'Size'
}: ProductActionsProps) => {
  const { addToCart, setIsOpen, setCheckoutStep } = useCart();
  
  // Find default active variant index
  const defaultIndex = variants && variants.length > 0 
    ? Math.max(0, variants.findIndex(v => v.isDefault && v.status === 'active'))
    : 0;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(defaultIndex);
  const [prevId, setPrevId] = useState(id);

  if (id !== prevId) {
    setPrevId(id);
    setSelectedVariantIndex(defaultIndex);
  }

  const hasVariant = !!hasVariantPricing && variants && variants.length > 0;
  const activeVariant = hasVariant ? variants[selectedVariantIndex] : null;

  const currentPrice = activeVariant ? activeVariant.price : price;
  const currentUnit = activeVariant ? activeVariant.unit : productUnit;
  const currentStock = activeVariant ? activeVariant.stock : undefined;

  // Parse minimum quantity from MOQ string e.g. "200 PCS" -> 200
  const getInitialQuantity = () => {
    if (!moq) return 1;
    const parsed = parseInt(moq.replace(/\D/g, ''));
    return isNaN(parsed) ? 1 : parsed;
  };

  const [quantity, setQuantity] = useState(getInitialQuantity());

  const total = currentPrice * quantity;
  const gst = total * 0.18;
  const grandTotal = total + gst;

  const handleQuantityChange = (change: number) => {
    const newQty = Math.max(1, quantity + change);
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      name: activeVariant ? `${productName} (${activeVariant.label})` : productName,
      price: currentPrice,
      image: productImage || '',
      category: productCategory || 'Connector',
      moq: moq || '200 PCS',
      unit: currentUnit,
      size: activeVariant ? activeVariant.label : undefined,
      cartId: activeVariant ? `${id}-${activeVariant.id}` : id
    }, quantity);
    setCheckoutStep('cart');
    setIsOpen(true);
  };

  const handleBuyNow = () => {
    addToCart({
      id,
      name: activeVariant ? `${productName} (${activeVariant.label})` : productName,
      price: currentPrice,
      image: productImage || '',
      category: productCategory || 'Connector',
      moq: moq || '200 PCS',
      unit: currentUnit,
      size: activeVariant ? activeVariant.label : undefined,
      cartId: activeVariant ? `${id}-${activeVariant.id}` : id
    }, quantity);
    setCheckoutStep('form');
    setIsOpen(true);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Variant Selector & Details (Conditional) */}
      {hasVariantPricing && variants && variants.length > 0 && (
        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Select {variantType || 'Option'}
            </label>
            <div className="relative">
              <select
                value={selectedVariantIndex}
                onChange={(e) => setSelectedVariantIndex(parseInt(e.target.value))}
                className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl py-4 px-6 font-bold text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-red outline-none appearance-none cursor-pointer text-sm shadow-sm transition-all"
              >
                {variants.map((v, idx) => (
                  <option key={v.id || idx} value={idx} disabled={v.status === 'inactive'}>
                    {v.label} - ₹{v.price} / {v.unit} {v.sku ? `(${v.sku})` : ''} {v.stock <= 0 ? ' [OUT OF STOCK]' : ''}
                  </option>
                ))}
              </select>
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>

          {/* Dynamic Variant Details */}
          <div className="flex flex-wrap gap-3 items-center">

            {currentStock !== undefined && (
              <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border flex items-center gap-2 ${
                currentStock > 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40' 
                  : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${currentStock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {currentStock > 0 ? `In Stock (${currentStock} units)` : 'Out of Stock'}
              </div>
            )}
          </div>

          {/* Dynamic Price Box */}
          <div className="w-full bg-[#F4FBF7] dark:bg-emerald-950/20 border border-[#E6F4EA] dark:border-emerald-900/40 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-900 dark:text-gray-100 font-extrabold text-base">Base Price:</span>
              <span className="text-3xl font-black text-[#007A53] dark:text-emerald-400">
                ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">GST 18%:</span>
              <span className="text-base font-bold text-gray-700 dark:text-gray-300">
                ₹{(currentPrice * 0.18).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-[#D0F0DB] dark:border-emerald-900/40 my-4" />
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">Final Price (Inclusive of all taxes):</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">
                ₹{(currentPrice * 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {(currentUnit || 'pcs').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Price Summary & Quantity Adjuster Grid */}
      <div className="bg-white dark:bg-neutral-900 rounded-[30px] p-6 border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Quantity Controller */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Adjust Quantity</p>
          <div className="flex items-center bg-gray-50 dark:bg-neutral-800 rounded-xl p-1 shadow-sm border border-gray-100 dark:border-neutral-700">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-neutral-700 hover:text-brand-red transition-all text-gray-400 cursor-pointer"
            >
              <Minus size={18} />
            </button>
            <input
              type="number"
              min={1}
              value={quantity === 0 ? '' : quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) {
                  setQuantity(1);
                } else {
                  setQuantity(val);
                }
              }}
              className="w-16 text-center font-black text-brand-dark dark:text-white text-lg bg-transparent outline-none border-b border-transparent focus:border-brand-red [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-neutral-700 hover:text-brand-red transition-all text-gray-400 cursor-pointer"
            >
              <Plus size={18} />
            </button>
          </div>
          {moq && (
            <p className="text-[10px] text-gray-400 mt-2 font-bold italic">
              Minimum Order Quantity (MOQ): {moq}
            </p>
          )}
        </div>

        {/* Live Calculation Display */}
        <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-1 w-full sm:w-auto">
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            Base Price: <span className="font-extrabold text-gray-700">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
            GST (18%): <span className="font-extrabold text-gray-700">₹{gst.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="w-24 border-t border-gray-200 my-1" />
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5 font-bold">Estimated Subtotal</p>
            <p className="text-3xl font-black text-brand-red">₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[9px] font-extrabold text-emerald-600 uppercase mt-0.5 tracking-wider">Inclusive of GST</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-brand-light hover:bg-brand-red/10 text-brand-red border border-brand-red/30 py-5 rounded-[24px] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
        >
          <ShoppingBag size={20} className="group-hover:rotate-6 transition-transform" />
          Add to Cart
        </button>

        {/* Buy Now / Proceed */}
        <button
          onClick={handleBuyNow}
          className="w-full bg-brand-red hover:bg-brand-dark text-white py-5 rounded-[24px] font-black text-lg transition-all shadow-xl shadow-brand-red/25 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group"
        >
          <ShoppingCart size={20} className="group-hover:translate-x-0.5 transition-transform" />
          Buy Now / Request Quote
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProductActions;
