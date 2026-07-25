"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

import { NAV_DATA, NAV_ICONS } from "@/data/header";
// CartDrawer ইমপোর্ট করা হলো
import CartDrawer from "@/components/cart/CartDrawer";

export default function Header() {
  const { cartItems, wishlistItems, isLoaded } = useCart();
  
  // Supabase Auth State
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [headerState, setHeaderState] = useState("top");
  
  // কার্ট ড্রয়ার ওপেন/ক্লোজ করার স্টেট
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch Supabase Session on Mount
  useEffect(() => {
    const supabase = createClient();
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setStatus(session ? "authenticated" : "unauthenticated");
    };
    
    getSession();

    // Listen for login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setStatus(session ? "authenticated" : "unauthenticated");
    });

    return () => subscription.unsubscribe();
  }, []);

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    setMobileActiveDropdown(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 300) {
        setHeaderState("scrolled");
      } else if (currentScroll > 100) {
        setHeaderState("hidden");
      } else {
        setHeaderState("top");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // মোবাইল মেনু বা কার্ট ড্রয়ার ওপেন থাকলে বডি স্ক্রল বন্ধ করা
  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen, isCartOpen]);

  const toggleMobileDropdown = (id) => {
    setMobileActiveDropdown(mobileActiveDropdown === id ? null : id);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-[90] transition-transform duration-500 ease-in-out bg-white shadow-md lg:bg-transparent lg:shadow-none ${
          headerState === "hidden" ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-[1320px] h-[90px] lg:h-[90px] mx-auto px-4 lg:px-6 flex items-center justify-between">
          <Link href="/" className="z-50" onClick={closeAllMenus}>
            <Image
              src="/images/logo1.png"
              alt="Logo"
              width={130}
              height={40}
              priority
              className="object-cover bg-center lg:w-[200px] lg:h-[100px]"
            />
          </Link>

          <nav className="hidden lg:block bg-[#9696a6] px-8 py-3 rounded-full shadow-sm">
            <ul className="flex items-center gap-6 lg:gap-8 text-[15px] font-bold text-white tracking-wide">
              {NAV_DATA.map((item) => {
                const isOpen = activeDropdown === item.id;
                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.id)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.categories ? (
                      <>
                        <button className="flex items-center gap-1 hover:text-gray-200 transition-colors duration-300">
                          {item.label}
                          <ChevronDown
                            size={16}
                            strokeWidth={2.5}
                            className={`transition transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {isOpen && (
                          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[18px] z-50">
                            <div className="w-[240px] bg-[#9696a6] text-white border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
                              {item.categories.map((cat, idx) => (
                                <Link
                                  key={cat.id || idx}
                                  href={cat.href || `/${cat.label.toLowerCase()}`}
                                  onClick={closeAllMenus}
                                  className="block px-6 py-3 hover:bg-black/10 transition-colors"
                                >
                                  {cat.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className="hover:text-gray-200 transition-colors duration-300"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 lg:gap-5 shrink-0 z-50">
            <div className="flex items-center gap-4 lg:gap-5">
              {NAV_ICONS.map((icon) => {
                const isCart = icon.id === "cart";
                const isWishlist = icon.id === "wishlistt";
                const isUserIcon = icon.id === "user" || icon.id === "profile" || icon.id === "account";
                
                const count = isCart ? cartItems.length : (isWishlist ? wishlistItems.length : 0);
                
                let targetHref = icon.href;
                
                if (isUserIcon) {
                  if (status === 'loading') {
                    targetHref = '#'; 
                  } else if (status === 'authenticated') {
                    targetHref = user?.user_metadata?.role === 'admin' ? '/admin' : '/account';
                  } else {
                    targetHref = '/login';
                  }
                }

                // যদি এটি কার্ট আইকন হয়, তবে লিংক না করে বাটন বানানো হলো
                if (isCart) {
                  return (
                    <button 
                      key={icon.id}
                      onClick={() => setIsCartOpen(true)}
                      className="relative inline-block group focus:outline-none"
                    >
                      <div className="w-10 h-10 lg:w-11 lg:h-11 bg-black rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shadow-sm">
                        <img
                          src={icon.src}
                          alt={icon.alt}
                          className="w-5 h-5 lg:w-5 lg:h-5 object-contain"
                        />
                      </div>
                      {isLoaded && count > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-[#00c3ff] text-white text-[11px] font-extrabold w-[22px] h-[22px] flex items-center justify-center rounded-full border-[2.5px] border-white shadow-md z-10 transform transition-transform group-hover:scale-110">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                }

                // কার্ট ছাড়া অন্য সব আইকনের জন্য সাধারণ লিংক
                return (
                  <Link 
                    key={icon.id} 
                    href={targetHref} 
                    className={`relative inline-block group ${isUserIcon && status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-10 h-10 lg:w-11 lg:h-11 bg-black rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shadow-sm">
                      <img
                        src={icon.src}
                        alt={icon.alt}
                        className="w-5 h-5 lg:w-5 lg:h-5 object-contain"
                      />
                    </div>
                    {isLoaded && count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#00c3ff] text-white text-[11px] font-extrabold w-[22px] h-[22px] flex items-center justify-center rounded-full border-[2.5px] border-white shadow-md z-10 transform transition-transform group-hover:scale-110">
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <button
              className="lg:hidden text-black p-1 focus:outline-none ml-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ top: "90px" }}
        >
          <div className="p-6 pb-24">
            <ul className="flex flex-col gap-5 text-[17px] font-bold text-gray-900">
              {NAV_DATA.map((item) => {
                const isDropdownOpen = mobileActiveDropdown === item.id;
                return (
                  <li key={item.id} className="border-b border-gray-100 pb-4">
                    {item.categories ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(item.id)}
                          className="w-full flex items-center justify-between hover:text-[#00c3ff] transition-colors"
                        >
                          {item.label}
                          <ChevronDown
                            size={20}
                            className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-[#00c3ff]" : ""}`}
                          />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? "max-h-screen mt-4" : "max-h-0"}`}>
                          <div className="pl-4 border-l-2 border-[#00c3ff]/30 flex flex-col gap-4 text-base text-gray-700">
                            {item.categories.map((cat, idx) => (
                              <Link
                                key={cat.id || idx}
                                href={cat.href || `/${cat.label.toLowerCase()}`}
                                onClick={closeAllMenus}
                                className="block font-semibold hover:text-[#00c3ff]"
                              >
                                {cat.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeAllMenus}
                        className="block hover:text-[#00c3ff] transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}