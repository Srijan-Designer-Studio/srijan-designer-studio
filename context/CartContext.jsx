"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getCart, addToCart as addToCartDB, removeFromCartDB, updateCartQuantityDB } from "@/app/actions/shopping";
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
              id: item.product_variants?.products?.id || item.id,
              variantId: item.variant_id || item.id,
              title: item.product_variants?.products?.title || 'Unknown Product',
              price: item.product_variants?.products?.base_price || 0,
              image: item.product_variants?.products?.product_images?.[0]?.image_url,
              quantity: item.quantity,
              size: item.product_variants?.size,
              color: item.product_variants?.color,
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

  const addToCart = async (product, quantity = 1) => {
    const targetId = product.variantId || product.id;
    let newQuantity = quantity;

    setCartItems((prev) => {
      const existing = prev.find((item) => (item.variantId || item.id) === targetId);
      if (existing) {
        newQuantity = existing.quantity + quantity;
        return prev.map((item) =>
          (item.variantId || item.id) === targetId ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await addToCartDB(targetId, newQuantity);
    }
  };

  const removeFromCart = async (idToRemove) => {
    setCartItems((prev) => prev.filter((item) => (item.variantId || item.id) !== idToRemove));

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await removeFromCartDB(idToRemove);
    }
  };

  const updateQuantity = async (idToUpdate, quantity) => {
    if (quantity < 1) return;
    
    setCartItems((prev) =>
      prev.map((item) => ((item.variantId || item.id) === idToUpdate ? { ...item, quantity } : item))
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await updateCartQuantityDB(idToUpdate, quantity);
    }
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