'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

export default function CategoryClient({ products, pageTitle, emptyMessage }) {
  const { wishlistItems, toggleWishlist } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    try {
      await toggleWishlistServer(product.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 uppercase text-black tracking-wide">
        {pageTitle}
      </h1>
      
      {currentProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 relative z-10">
            {currentProducts.map((product) => {
              const imageUrl = product.product_images?.[0]?.image_url || "/images/placeholder.jpg";
              const basePrice = Number(product.base_price) || 0;
              const salePrice = Number(product.sale_price) || 0;
              const hasDiscount = salePrice > 0 && salePrice < basePrice;
              const displayPrice = hasDiscount ? salePrice : basePrice;
              const isWishlisted = wishlistItems?.some(item => item.id === product.id);

              return (
                <Link key={product.id} href={`/product/${product.slug || product.id}`} prefetch={false} className="group flex flex-col items-center text-center cursor-pointer relative">
                  <div className="w-full aspect-[2/3] rounded-2xl border border-black overflow-hidden mb-4 relative bg-gray-50">
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
                    >
                      <Heart 
                        size={30} 
                        className={`transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-[#00c3ff]'}`} 
                      />
                    </button>
                  </div>
                  
                  <h3 className="text-[16px] font-medium text-gray-800 leading-tight mb-2 line-clamp-2 px-2 group-hover:text-black">
                    {product.title}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-[18px] font-extrabold text-red-600">
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </p>
                    {hasDiscount && (
                      <p className="text-[14px] font-medium text-black line-through">
                        ₹{basePrice.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-16 relative z-10">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:bg-[#00c3ff] hover:text-white hover:border-[#00c3ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                    currentPage === idx + 1
                      ? 'bg-[#00c3ff] text-white shadow-md'
                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-[#00c3ff]/10 hover:text-[#00c3ff] hover:border-[#00c3ff]/30'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 border border-gray-200 text-gray-500 hover:bg-[#00c3ff] hover:text-white hover:border-[#00c3ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500 font-medium relative z-10">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}