import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useContext(AuthContext);

  // Fetch Cart Items from DB
  const fetchCart = async () => {
    if (!token || user?.role === 'admin') {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/api/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync cart when token/user change
  useEffect(() => {
    fetchCart();
  }, [token, user]);

  // Add Item to Cart / Update Quantity
  const addToCart = async (productId, quantity = 1, overrideQuantity = false) => {
    if (!token) {
      return { success: false, message: 'Please log in to add items to your cart' };
    }
    try {
      const response = await api.post('/api/cart/add', {
        productId,
        quantity,
        overrideQuantity
      });
      setCartItems(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      const message = error.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message };
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      const response = await api.delete(`/api/cart/remove?productId=${productId}`);
      setCartItems(response.data);
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      const message = error.response?.data?.message || 'Failed to remove item';
      return { success: false, message };
    }
  };

  // Clear Cart locally
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculated properties
  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  
  const cartSubtotal = cartItems.reduce((acc, item) => {
    const product = item.productId;
    if (!product) return acc;
    const finalPrice = product.price * (1 - (product.discount || 0) / 100);
    return acc + (finalPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        fetchCart,
        cartCount,
        cartSubtotal: Math.round(cartSubtotal * 100) / 100
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
