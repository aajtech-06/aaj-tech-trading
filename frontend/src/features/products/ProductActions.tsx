'use client';

import React, { useState } from 'react';
import { ShoppingCart, ShoppingBag, Minus, Plus, ArrowRight } from 'lucide-react';

import { useCart } from '@/context/CartContext';

interface ProductActionsProps {
  id: string;
  price: number;
  productName: string;
  productImage?: string;
  productCategory?: string;
  moq?: string;
}

const ProductActions = ({ id, price, productName, productImage, productCategory, moq }: ProductActionsProps) => {
  const { addToCart, setIsOpen, setCheckoutStep } = useCart();
  
  // Parse minimum quantity from MOQ string e.g. "200 PCS" -> 200
  const getInitialQuantity = () => {
    if (!moq) return 1;
    const parsed = parseInt(moq.replace(/\D/g, ''));
    return isNaN(parsed) ? 1 : parsed;
  };

  const [quantity, setQuantity] = useState(getInitialQuantity());

  const total = price * quantity;
  const gst = total * 0.18;
  const grandTotal = total + gst;

  const handleQuantityChange = (change: number) => {
    let newQty = quantity + change;
    const moqNumber = getInitialQuantity();
    if (newQty < moqNumber) {
      newQty = moqNumber;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = () => {
    addToCart({
      id,
      name: productName,
      price,
      image: productImage || '',
      category: productCategory || 'Connector',
      moq: moq || '200 PCS'
    }, quantity);
    setCheckoutStep('cart');
    setIsOpen(true);
  };

  const handleBuyNow = () => {
    addToCart({
      id,
      name: productName,
      price,
      image: productImage || '',
      category: productCategory || 'Connector',
      moq: moq || '200 PCS'
    }, quantity);
    setCheckoutStep('form');
    setIsOpen(true);
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Price Summary & Quantity Adjuster Grid */}
      <div className="bg-white rounded-[30px] p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Quantity Controller */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Adjust Quantity</p>
          <div className="flex items-center bg-gray-50 rounded-xl p-1 shadow-sm border border-gray-100">
            <button
              type="button"
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:text-brand-red transition-all text-gray-400 cursor-pointer"
            >
              <Minus size={18} />
            </button>
            <span className="w-16 text-center font-black text-brand-dark text-lg">{quantity}</span>
            <button
              type="button"
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white hover:text-brand-red transition-all text-gray-400 cursor-pointer"
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
