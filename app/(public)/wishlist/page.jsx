"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart, cartItems, isLoaded } = useCart();

 
  if (!isLoaded) return <div className="min-h-screen bg-[#f8f9fa]"></div>;

  return (
    <main className="py-16 md:py-24 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-[1320px] mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-black uppercase tracking-wider mb-10 text-center">
          Your Wishlist
        </h1>

        {/* Wishlist Empty State */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white p-12 md:p-16 rounded-3xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto transition-all">
            <Heart size={80} className="text-gray-200 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Save your favorite items here to review and buy them later.</p>
            <Link href="/product">
              <button className="bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3.5 px-10 rounded-full transition-colors shadow-md uppercase tracking-wide">
                Explore Products
              </button>
            </Link>
          </div>
        ) : (
          /* Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {wishlistItems.map((item) => {
              
              const isInCart = cartItems.some((cartItem) => cartItem.id === item.id);

              return (
                <div key={item.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300">
                  
                  {/* Product Image */}
                  <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden block">
                    <Link href={`/product/${item.id}`}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                    
                    {/* Remove from Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(item)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} className="text-red-500 hover:text-red-600" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-grow">
                    <Link href={`/product/${item.id}`}>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#00c3ff] transition-colors">
                        {item.title}
                      </h3>
                    </Link>
                    
                    <p className="text-xl font-extrabold text-black mb-5 mt-2">
                      ₹{item.price?.toLocaleString('en-IN') || item.price}
                    </p>
                    
                    {/* Add to Cart Button */}
                    <button 
                      onClick={() => addToCart(item, 1)}
                      disabled={isInCart}
                      className={`mt-auto w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-[13px] uppercase tracking-wide transition-all ${
                        isInCart 
                          ? 'bg-green-50 text-green-600 border-2 border-green-500 cursor-default' 
                          : 'bg-black text-white hover:bg-gray-800 shadow-md'
                      }`}
                    >
                      <ShoppingCart size={18} />
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </button>
                  </div>
                  
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}