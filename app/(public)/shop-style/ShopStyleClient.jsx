'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductsHero from "@/components/product/ProductsHero";
import { getProducts } from "@/app/actions/products";
import { searchProducts } from "@/app/actions/search";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

export default function ShopStyleClient() {
  const { wishlistItems, toggleWishlist } = useCart();
  const [allProducts, setAllProducts] = useState([]);
  const [backendSearchResults, setBackendSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestedWords, setSuggestedWords] = useState([]);

  const itemsPerPage = 12;
  const placeholders = ["sarees...", "lehengas...", "kurtis...", "ethnic wear...", "gowns...", "wedding collections..."];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(intervalId);
  }, [placeholders.length]);

  useEffect(() => {
    async function fetchInitialProducts() {
      try {
        setIsLoading(true);
        const response = await getProducts();
        const products = Array.isArray(response) ? response : (response?.data || []);
        setAllProducts(products);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const query = searchQuery.toLowerCase().trim();
      const wordsSet = new Set();

      allProducts.forEach(p => {
        const words = p.title.split(/[\s,.-]+/);
        words.forEach(w => {
          const cleanWord = w.replace(/[^a-zA-Z0-9]/g, '');
          if (cleanWord.length > 2 && cleanWord.toLowerCase().includes(query)) {
            wordsSet.add(cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1).toLowerCase());
          }
        });
      });

      setSuggestedWords(Array.from(wordsSet).slice(0, 6));
    } else {
      setSuggestedWords([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchProducts({
            searchTerm: searchQuery.trim(),
            limit: 100
          });
          setBackendSearchResults(results.products || []);
        } catch (error) {
          setBackendSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setBackendSearchResults([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  let displayedProducts = allProducts;
  const query = searchQuery.trim().toLowerCase();

  if (query.length > 0) {
    const localResults = allProducts.filter(p =>
      p.title?.toLowerCase().includes(query)
    );

    const combinedMap = new Map();

    localResults.forEach(p => combinedMap.set(p.id, p));

    if (query.length >= 2) {
      backendSearchResults.forEach(p => combinedMap.set(p.id, p));
    }

    displayedProducts = Array.from(combinedMap.values());
  }

  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
  const currentProducts = displayedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product);
    try {
      await toggleWishlistServer(product.id);
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <ProductsHero />

      <div className="max-w-[1200px] mx-auto px-6 py-12">

        <div className="flex flex-col items-center justify-center mb-12 space-y-8">
          <div className="relative w-full max-w-[500px] z-50">
            <input
              type="text"
              placeholder={`Search for ${placeholders[placeholderIndex]}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="w-full pl-6 pr-12 py-3.5 border-2 border-[#00c3ff] rounded-full outline-none text-sm placeholder:text-[#00c3ff]/60 text-gray-800 font-medium shadow-[0_0_15px_rgba(0,195,255,0.15)] focus:shadow-[0_0_20px_rgba(0,195,255,0.3)] transition-all"
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-[#00c3ff]" size={20} />

            {isFocused && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 w-full mt-3 bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
                {isSearching && suggestedWords.length === 0 ? (
                  <div className="p-4 text-center text-sm font-medium text-gray-500">Searching...</div>
                ) : suggestedWords.length > 0 ? (
                  <div className="flex flex-col py-2">
                    {suggestedWords.map((word, idx) => (
                      <button
                        key={idx}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setSearchQuery(word);
                          setIsFocused(false);
                        }}
                        className="flex items-center gap-3 px-5 py-2.5 hover:bg-[#00c3ff]/10 transition-colors text-left cursor-pointer group"
                      >
                        <Search size={14} className="text-gray-400 group-hover:text-[#00c3ff] transition-colors" />
                        <span className="text-[14px] font-semibold text-gray-700 group-hover:text-[#00c3ff]">
                          {word}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm font-medium text-gray-500">No suggestions found</div>
                )}
              </div>
            )}
          </div>
          <h2 className="text-[28px] font-bold text-black tracking-wide">Shop Styles</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#00c3ff] rounded-full animate-spin"></div>
          </div>
        ) : currentProducts.length > 0 ? (
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
                  <Link key={product.id} href={`/product/${product.slug}`} prefetch={false} className="group flex flex-col items-center text-center cursor-pointer relative">
                    <div className="w-full aspect-[2/3] rounded-2xl border border-black overflow-hidden mb-4 relative bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />

                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
                      >
                        <Heart
                          className={`w-5 h-5 sm:w-[30px] sm:h-[30px] transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-[#00c3ff]'
                            }`}
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
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-colors cursor-pointer ${currentPage === idx + 1
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
        ) : isSearching ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#00c3ff] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 font-medium relative z-10">
            No products found matching "{searchQuery}".
          </div>
        )}

      </div>
    </main>
  );
}