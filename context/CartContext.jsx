"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "@/app/actions/shopping";
import { createClient } from "@/lib/supabase/client";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      // 1. Check for logged-in user
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        try {
          // Fetch synced cart from Supabase database
          const dbCart = await getCart();
          if (dbCart && dbCart.cart_items) {
            // Map Database structure to Local Context structure
            const mappedCart = dbCart.cart_items.map(item => ({
              id: item.product_variants.products.id,
              variantId: item.variant_id,
              title: item.product_variants.products.title,
              price: item.product_variants.products.base_price,
              image: item.product_variants.products.product_images?.[0]?.image_url,
              quantity: item.quantity,
              size: item.product_variants.size,
              color: item.product_variants.color,
            }));
            setCartItems(mappedCart);
          }
        } catch (error) {
          console.error("Failed to sync DB cart, falling back to local storage.", error);
        }
      } else {
        // Guest User: Fallback to LocalStorage
        const savedCart = localStorage.getItem("srijan_cart");
        const savedWishlist = localStorage.getItem("srijan_wishlist");
        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
      }
      
      setIsLoaded(true);
    }
    
    loadData();
  }, []);

  useEffect(() => {
    // Only sync to local storage for quick access / offline mode
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