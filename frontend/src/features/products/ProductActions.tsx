'use client';

import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';

import { useCart } from '@/context/CartContext';
import { Variant } from '@/types';

interface ProductActionsProps {
  id: string;
  price: number | null;
  productName: string;
  productImage?: string;
  productCategory?: string;
  moq?: string;
  productUnit?: string;
  hasVariantPricing?: boolean;
  variants?: Variant[];
  variantType?: string;
  sku?: string;
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
  variantType = 'Size',
  sku
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
  const safePrice = currentPrice !== null ? currentPrice : 0;

  // Parse minimum quantity from MOQ string e.g. "200 PCS" -> 200
  const getInitialQuantity = () => {
    if (!moq) return 1;
    const parsed = parseInt(moq.replace(/\D/g, ''));
    return isNaN(parsed) ? 1 : parsed;
  };

  const [quantity, setQuantity] = useState(getInitialQuantity());

  const total = safePrice * quantity;
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
      price: safePrice,
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
      price: safePrice,
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

  const handleWhatsAppEnquiry = () => {
    const phoneNumber = '9910009227';
    const currentSku = activeVariant && activeVariant.sku ? activeVariant.sku : sku;
    const currentName = activeVariant ? `${productName} (${activeVariant.label})` : productName;
    
    let message = `Hi, I am interested in ${currentName}.\n`;
    if (currentSku) {
      message += `SKU: ${currentSku}\n`;
    }
    message += `Please share price and availability.`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
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
                ₹{safePrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">GST 18%:</span>
              <span className="text-base font-bold text-gray-700 dark:text-gray-300">
                ₹{(safePrice * 0.18).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t border-[#D0F0DB] dark:border-emerald-900/40 my-4" />
            <div className="flex justify-between items-center flex-wrap gap-2">
              <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">Final Price (Inclusive of all taxes):</span>
              <span className="text-xl font-black text-gray-900 dark:text-white">
                ₹{(safePrice * 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {(currentUnit || 'pcs').toUpperCase()}
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
        {currentPrice !== null && (
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
        )}
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

      {/* Enquire on WhatsApp */}
      <button
        onClick={handleWhatsAppEnquiry}
        className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-5 rounded-[24px] font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer group shadow-xl shadow-emerald-500/10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        🟢 ENQUIRE ON WHATSAPP
      </button>
    </div>
  );
};

export default ProductActions;
