'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ArrowRight, CheckCircle2, ShoppingBag, Loader2, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';


export default function CartDrawer() {
  const {
    isOpen,
    setIsOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    totalAmount,
    clearCart,
    checkoutStep,
    setCheckoutStep
  } = useCart();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  if (!isOpen) return null;

  const gstAmount = totalAmount * 0.18;
  const grandTotal = totalAmount + gstAmount;

  const handleQtyChange = (itemId: string, currentQty: number, change: number, moqText?: string) => {
    let newQty = currentQty + change;
    if (moqText && change < 0) {
      // Parse minimum quantity from MOQ string e.g. "200 PCS" -> 200
      const moqNumber = parseInt(moqText.replace(/\D/g, '')) || 1;
      if (newQty < moqNumber) {
        // If they try to go below MOQ, ask or just enforce MOQ. Let's enforce MOQ as minimum.
        newQty = moqNumber;
      }
    } else if (newQty < 1) {
      newQty = 1;
    }
    updateQuantity(itemId, newQty);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const itemsSummary = cartItems
      .map(item => `${item.name} (Qty: ${item.quantity}, Price: ₹${item.price.toLocaleString('en-IN')})`)
      .join(', ');

    const inquiryMessage = formData.message 
      ? `${formData.message}\n\nSelected Products:\n${itemsSummary}`
      : `Cart Inquiry for:\n${itemsSummary}`;

    try {
      const response = await fetch('https://aajtechtrading.in/api/enquiries/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiryType: "Cart Inquiry",
          message: inquiryMessage,
          productName: `Cart (${cartItems.length} unique items)`,
          quantity: cartItems.reduce((sum, i) => sum + i.quantity, 0),
          totalPrice: grandTotal,
          items: cartItems.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            moq: item.moq || 'N/A'
          }))
        }),
      });

      if (response.ok) {
        setCheckoutStep('success');
        setTimeout(() => {
          clearCart();
          setIsOpen(false);
          setCheckoutStep('cart');
          setFormData({ name: '', email: '', phone: '', message: '' });
        }, 4000);
      } else {
        console.error("Inquiry request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Cart inquiry submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidImageUrl = (url?: string) => {
    if (!url) return false;
    if (url.startsWith('/')) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-brand-dark/50 backdrop-blur-sm cursor-pointer"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md md:max-w-lg bg-white dark:bg-neutral-900 h-full shadow-2xl flex flex-col z-10 border-l border-gray-100 dark:border-neutral-800 transition-colors duration-300"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red/5 rounded-xl flex items-center justify-center text-brand-red">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-brand-dark dark:text-white">Your Shopping Cart</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-xl text-gray-400 hover:text-brand-red transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0 bg-gray-50/50 dark:bg-neutral-950/40">
            {checkoutStep === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6 px-4"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-500/20 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-brand-dark">Inquiry Submitted!</h4>
                  <p className="text-gray-500 font-bold mt-2">
                    We have received your consolidated request. Our sales team will get back to you shortly with quotes.
                  </p>
                  <p className="text-xs text-brand-red font-black uppercase tracking-widest mt-6 animate-pulse">
                    Closing Cart in 4 seconds...
                  </p>
                </div>
              </motion.div>
            ) : checkoutStep === 'form' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Back Button */}
                <button
                  onClick={() => setCheckoutStep('cart')}
                  className="flex items-center gap-2 text-xs font-black text-gray-400 hover:text-brand-red uppercase tracking-wider cursor-pointer"
                >
                  <ArrowLeft size={16} /> Back to Cart
                </button>

                <div>
                  <h4 className="text-xl font-black text-brand-dark">Finalize Quotation Inquiry</h4>
                  <p className="text-gray-500 text-xs mt-1 font-medium">Please provide your contact information to receive customized bulk pricing.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        type="email"
                        required
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                      <input
                        type="tel"
                        required
                        placeholder="+91 00000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Requirements (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Specify packaging details, customization needs, or shipping deadlines..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 font-bold text-brand-dark focus:ring-2 focus:ring-brand-red outline-none text-sm transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-dark hover:bg-brand-red text-white py-4 rounded-xl font-black text-base transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-8"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Submit Consolidated Inquiry
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-400">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h4 className="font-black text-brand-dark dark:text-white text-lg">Your cart is empty</h4>
                  <p className="text-gray-400 text-sm font-medium mt-1">Browse our connector catalog to add items.</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-red hover:bg-brand-dark text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    exit={{ opacity: 0, y: -25 }}
                    className="bg-white dark:bg-neutral-900 rounded-2xl p-4 border border-gray-100 dark:border-neutral-800 shadow-sm flex items-center gap-4 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 dark:bg-neutral-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-neutral-700 p-1">
                      {isValidImageUrl(item.image) ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ShoppingBag size={20} className="text-gray-300" />
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-4">
                      <span className="text-[9px] font-black text-brand-red uppercase tracking-wider block mb-0.5">
                        {item.category || 'Connector'}
                      </span>
                      <h4 className="font-extrabold text-brand-dark text-xs sm:text-sm leading-snug line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] font-black text-gray-400 mt-0.5">
                        ₹{item.price.toLocaleString('en-IN')}.00 / pcs
                      </p>
                      
                      {/* MOQ reminder */}
                      {item.moq && (
                        <p className="text-[9px] font-semibold text-gray-400 italic">
                          MOQ: {item.moq}
                        </p>
                      )}
                    </div>

                    {/* Quantity Selector & Trash */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity, -1, item.moq)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white hover:text-brand-red text-gray-400 transition-all cursor-pointer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center font-black text-brand-dark text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(item.id, item.quantity, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-white hover:text-brand-red text-gray-400 transition-all cursor-pointer"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-brand-dark text-xs">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}.00
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-300 hover:text-brand-red transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer (Total & Checkout) */}
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <div className="px-6 py-6 border-t border-gray-100 bg-white space-y-4 shrink-0 shadow-[0_-10px_35px_rgba(0,0,0,0.02)]">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <span>Base Total:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider">
                  <span>GST (18%):</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="border-t border-dashed border-gray-200 my-2" />
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                    <p className="text-2xl font-black text-brand-red leading-none">
                      ₹{grandTotal.toLocaleString('en-IN')}.00
                    </p>
                  </div>
                  <p className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-wider">Inclusive of GST</p>
                </div>
              </div>

              <button
                onClick={() => setCheckoutStep('form')}
                className="w-full bg-brand-red hover:bg-brand-dark text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
              >
                Proceed to Inquiry
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
