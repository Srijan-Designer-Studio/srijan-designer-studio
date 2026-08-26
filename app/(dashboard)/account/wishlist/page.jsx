'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart, Loader2, HeartCrack } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toggleWishlist as toggleWishlistServer } from '@/app/actions/shopping';
import { createBrowserClient } from '@supabase/ssr';

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart, isLoaded } = useCart();
  const [processingId, setProcessingId] = useState(null);

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ));

  const handleRemove = async (product) => {
    setProcessingId(product.id);
    try {
      await toggleWishlistServer(product.id);
      toggleWishlist(product);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleMoveToCart = async (product) => {
    setProcessingId(product.id);
    try {
      const { data: variants } = await supabase
        .from('product_variants')
        .select('id, size, color')
        .eq('product_id', product.id)
        .limit(1);

      const variant = variants?.[0];

      if (!variant) {
        alert("Sorry, this product is currently unavailable.");
        setProcessingId(null);
        return;
      }

      const cartItem = {
        ...product,
        variantId: variant.id,
        size: variant.size,
        color: variant.color
      };

      await addToCart(cartItem, 1);
      await toggleWishlistServer(product.id);
      toggleWishlist(product);
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-[120px]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0ba6ff]" />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-[120px] px-4">
        <HeartCrack className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-[15px] text-gray-500 mb-6 text-center max-w-md">
          Looks like you haven't saved any items yet. Explore our designer collection and add your favorites here!
        </p>
        <Link href="/shop-style" className="bg-[#0ba6ff] text-white px-8 py-3 rounded-full font-bold hover:bg-[#0092e6] transition-colors shadow-md cursor-pointer">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-[100px] lg:pt-[120px] space-y-6 font-sans min-h-screen pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-[15px] text-gray-500 mt-1">Items you have saved for later ({wishlistItems.length} items).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
              <Image
                src={item.image || item.product_images?.[0]?.image_url || '/images/placeholder.jpg'}
                alt={item.title || item.name || 'Product'}
                fill
                unoptimized
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              <button
                onClick={() => handleRemove(item)}
                disabled={processingId === item.id}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              </button>

              <div className="absolute bottom-3 left-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider ${item.is_active !== false ? 'bg-white text-green-600' : 'bg-white text-red-600'
                  }`}>
                  {item.is_active !== false ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col h-[140px] justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {item.title || item.name}
                </h3>
                <p className="text-[16px] font-bold text-gray-900 mt-2">
                  ₹{Number(item.price || item.base_price || 0).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => handleMoveToCart(item)}
                disabled={processingId === item.id || item.is_active === false}
                className={`w-full py-2.5 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${item.is_active === false
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#0ba6ff] text-white hover:bg-[#0092e6] shadow-sm hover:shadow-md disabled:opacity-70'
                  }`}
              >
                {processingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <ShoppingCart size={16} />}
                {item.is_active === false ? 'Out of Stock' : 'Move to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}