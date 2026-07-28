"use client";

import { useState, useEffect } from "react";
import { X, Search as SearchIcon, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { searchProducts } from "@/app/actions/search"; // নতুন ফাংশন ইম্পোর্ট করা হলো

export default function SearchDrawer({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // রিয়েল-টাইম প্রোডাক্ট সাজেশন লজিক
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {

          const results = await searchProducts({ 
            searchTerm: searchQuery.trim(), 
            limit: 5 
          });
          
          setSuggestions(results.products || []);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
        setIsSearching(false);
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSearchQuery("");
      setSuggestions([]);
    }, 300);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={handleClose}
      ></div>

      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[101] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Search Products</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSearch} className="relative">
            <input 
              type="text" 
              placeholder="Search for fashion, dresses..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isOpen}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#00c3ff]/30 focus:border-[#00c3ff] transition-all text-gray-900 font-medium"
            />
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <button type="submit" className="hidden">Search</button>
          </form>

          <div className="mt-6">
            {searchQuery.trim().length < 2 ? (
              <p className="text-sm text-gray-400 text-center mt-10">
                Type at least 2 characters to see suggestions...
              </p>
            ) : isSearching ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-500">
                <Loader2 className="animate-spin text-[#00c3ff]" size={28} />
                <span className="text-sm font-medium">Finding products...</span>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Suggested Products
                </h3>
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    onClick={handleClose}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-[#00c3ff]/10 border border-transparent hover:border-[#00c3ff]/20 rounded-xl transition-all group cursor-pointer"
                  >
                    <span className="text-[15px] font-semibold text-gray-800 group-hover:text-[#00c3ff] line-clamp-1">
                      {item.title}
                    </span>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-[#00c3ff] transform group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                ))}
                
                <button 
                  onClick={handleSearch}
                  className="mt-2 w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-colors"
                >
                  View All Results for "{searchQuery}"
                </button>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                <p className="text-gray-500 text-[15px]">No products found for <span className="font-bold text-black">"{searchQuery}"</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}