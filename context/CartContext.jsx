"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCart } from "@/app/actions/shopping";
import { createBrowserClient } from '@supabase/ssr'

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ));

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        try {
          const dbCart = await getCart();
          if (dbCart && dbCart.cart_items) {
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
        const savedCart = localStorage.getItem("srijan_cart");
        const savedWishlist = localStorage.getItem("srijan_wishlist");
        if (savedCart) setCartItems(JSON.parse(savedCart));
        if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
      }

      setIsLoaded(true);
    }

    loadData();
  }, [supabase]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("srijan_cart", JSON.stringify(cartItems));
      localStorage.setItem("srijan_wishlist", JSON.stringify(wishlistItems));
    }
  }, [cartItems, wishlistItems, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variantId === product.variantId);
      if (existing) {
        return prev.map((item) =>
          item.variantId === product.variantId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (variantId) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.variantId === variantId ? { ...item, quantity } : item))
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

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("srijan_cart");
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
        clearCart,
        subtotal,
        isLoaded
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);