'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  cartId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
  moq?: string;
  unit?: string;
  size?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity' | 'cartId'> & { cartId?: string }, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalAmount: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  checkoutStep: 'cart' | 'form' | 'success';
  setCheckoutStep: (step: 'cart' | 'form' | 'success') => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('aaj_tech_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setTimeout(() => {
          setCartItems(parsed);
        }, 0);
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('aaj_tech_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, 'quantity' | 'cartId'> & { cartId?: string }, quantity?: number) => {
    let initialQty = quantity;
    if (initialQty === undefined || initialQty === null) {
      if (product.moq) {
        const parsed = parseInt(product.moq.replace(/\D/g, ''));
        initialQty = !isNaN(parsed) && parsed > 0 ? parsed : 1;
      } else {
        initialQty = 1;
      }
    }

    const cartId = product.cartId || (product.id + (product.size ? `-${product.size}` : ''));

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.cartId === cartId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + initialQty }
            : item
        );
      }
      return [...prevItems, { ...product, cartId, quantity: initialQty }];
    });
    setCheckoutStep('cart');
    setIsOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.cartId === cartId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('aaj_tech_cart');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        totalAmount,
        isOpen,
        setIsOpen,
        checkoutStep,
        setCheckoutStep,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
