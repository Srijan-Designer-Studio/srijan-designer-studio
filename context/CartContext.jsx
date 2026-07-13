"use client";

import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("srijan_cart");
    const savedWishlist = localStorage.getItem("srijan_wishlist");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("srijan_cart", JSON.stringify(cartItems));
      localStorage.setItem("srijan_wishlist", JSON.stringify(wishlistItems));
    }
  }, [cartItems, wishlistItems, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleWishlist = (product) => {
    setWishlistItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        wishlistItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        toggleWishlist, 
        subtotal, 
        isLoaded 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);