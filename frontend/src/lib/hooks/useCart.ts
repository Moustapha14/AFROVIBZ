import { useState, useEffect } from 'react';

import { CartItem, Product } from '@/types';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('afrovibz-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (!loading) {
      localStorage.setItem('afrovibz-cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = (product: Product, quantity: number = 1, size: string, color: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${size}-${color}`,
          productId: product.id,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          price: product.price,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(prevCart => prevCart.map(item => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: string, size: string, color: string) => {
    return cart.some(
      item =>
        item.productId === productId && item.selectedSize === size && item.selectedColor === color
    );
  };

  return {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
  };
}
