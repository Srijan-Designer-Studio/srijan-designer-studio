"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

import { NAV_DATA, NAV_ICONS } from "@/data/header";

import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/wishlist/WishlistDrawer";
import SearchDrawer from "@/components/search/SearchDrawer";

export default function Header({ initialUser = null }) {
  const pathname = usePathname();
  const { cartItems, wishlistItems, isLoaded } = useCart();
  const [user, setUser] = useState(initialUser);
  const [status, setStatus] = useState(initialUser ? "authenticated" : "unauthenticated");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollTimeout = useRef(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const supabase = createClient();
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

      if (currentScroll > lastScrollY.current && currentScroll > 80) {
        setIsVisible(false);
      } else if (currentScroll < lastScrollY.current) {
        setIsVisible(true);
      }

      lastScrollY.current = currentScroll;

      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        setIsVisible(true);
      }, 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen || isWishlistOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen, isCartOpen, isWishlistOpen, isSearchOpen]);

  const toggleMobileDropdown = (id) => {
    setMobileActiveDropdown(mobileActiveDropdown === id ? null : id);
  };

  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return null;
  }

  const renderIcons = (isMobile = false) => {
    return NAV_ICONS.map((icon) => {
      const isSearch = icon.id === "search";
      const isCart = icon.id === "cart";
      const isWishlist = icon.id === "wishlistt" || icon.id === "wishlist";
      const isUserIcon = icon.id === "user" || icon.id === "profile" || icon.id === "account";

      const count = isCart ? cartItems.length : (isWishlist ? wishlistItems.length : 0);
      let targetHref = icon.href;

      if (isUserIcon) {
        if (status === 'loading') targetHref = '#';
        else if (status === 'authenticated') targetHref = user?.user_metadata?.role === 'admin' ? '/admin' : '/account';
        else targetHref = '/login';
      }

      const iconContainerSize = isMobile ? "w-12 h-12" : "w-[50px] h-[50px]";
      const iconSize = isMobile ? "w-[22px] h-[22px]" : "w-[22px] h-[22px]";

      if (isCart || isWishlist || isSearch) {
        return (
          <button
            key={icon.id}
            onClick={() => {
              if (isMobile) setIsMobileMenuOpen(false);
              if (isCart) setIsCartOpen(true);
              else if (isWishlist) setIsWishlistOpen(true);
              else if (isSearch) setIsSearchOpen(true);
            }}
            className="relative inline-block group focus:outline-none cursor-pointer"
          >
            <div className={`${iconContainerSize} bg-black rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors shadow-md`}>
              {isSearch ? (
                <Search className={`text-white ${iconSize}`} strokeWidth={2.5} />
              ) : (
                <img src={icon.src} alt={icon.alt} className={`${iconSize} object-contain`} />
              )}
            </div>

            {isLoaded && count > 0 && !isSearch && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#00c3ff] text-white text-[11px] font-extrabold w-[22px] h-[22px] flex items-center justify-center rounded-full border-[2.5px] border-white shadow-md z-10 transform transition-transform group-hover:scale-110">
                {count}
              </span>
            )}
          </button>
        );
      }

      return (
        <Link
          key={icon.id}
          href={targetHref}
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className={`relative inline-block group ${isUserIcon && status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`${iconContainerSize} bg-black rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors shadow-md`}>
            <img src={icon.src} alt={icon.alt} className={`${iconSize} object-contain`} />
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[90] transition-transform duration-500 ease-in-out bg-transparent pointer-events-none ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-[1320px] h-[80px] lg:h-[90px] mx-auto px-4 lg:px-6 flex items-center justify-between pointer-events-auto">
          
          <Link 
  href="/" 
  className="z-50 relative h-[45px] w-[130px] lg:h-[60px] lg:w-[180px] shrink-0 flex items-center" 
  onClick={closeAllMenus}
>
  <Image
    src="/images/logo5.webp"
    alt="Logo"
    fill
    sizes="(max-width: 1024px) 130px, 180px"
    priority
    className="object-contain object-left"
  />
</Link>

          <nav className="hidden lg:flex bg-[#9696a6]/60 backdrop-blur-md border border-white/20 px-8 rounded-full shadow-lg h-[50px] items-center">
            <ul className="flex items-center gap-6 lg:gap-8 text-[15px] font-bold text-white tracking-wide h-full">
              {NAV_DATA.map((item) => {
                const isOpen = activeDropdown === item.id;
                
                return (
                  <li
                    key={item.id}
                    className="relative flex items-center h-full"
                    onMouseEnter={() => { setActiveDropdown(item.id); }}
                    onMouseLeave={() => { setActiveDropdown(null); }}
                  >
                    {item.categories ? (
                      <>
                        <button className="flex items-center gap-1 hover:text-gray-200 transition-colors duration-300 cursor-pointer h-full">
                          {item.label}
                          <ChevronDown
                            size={16}
                            strokeWidth={2.5}
                            className={`transition transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-[25px] z-50 transition-all duration-300 ease-out origin-top ${isOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible translate-y-4 scale-95"}`}>
                          <div className="w-[220px] bg-white text-gray-800 shadow-xl rounded-lg border border-gray-100 py-3 overflow-hidden">
                            {item.categories.map((cat, idx) => (
                              <Link
                                key={cat.id || idx}
                                href={cat.href || `/${cat.label.toLowerCase()}`}
                                onClick={closeAllMenus}
                                className="block px-6 py-3 text-[14px] font-medium transition-all duration-300 hover:text-[#00c3ff] hover:bg-gray-50 hover:pl-8 whitespace-nowrap"
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
                        className="hover:text-gray-200 transition-colors duration-300 h-full flex items-center"
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
            <div className="hidden lg:flex items-center gap-4 h-[50px]">
              {renderIcons(false)}
            </div>

            <button
              className="lg:hidden text-black p-1 focus:outline-none ml-2 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-white/90 backdrop-blur-xl z-[80] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col pt-[80px] ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ height: "100dvh" }}
      >
        <div className="flex flex-col h-full overflow-y-auto p-6">
          
          <ul className="flex flex-col gap-5 text-[17px] font-bold text-gray-900 flex-1 mt-4">
            {NAV_DATA.map((item) => {
              const isDropdownOpen = mobileActiveDropdown === item.id;
              return (
                <li key={item.id} className="border-b border-gray-200/50 pb-4">
                  {item.categories ? (
                    <>
                      <button
                        onClick={() => toggleMobileDropdown(item.id)}
                        className="w-full flex items-center justify-between hover:text-[#00c3ff] transition-colors cursor-pointer"
                      >
                        {item.label}
                        <ChevronDown
                          size={20}
                          className={`transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-[#00c3ff]" : ""}`}
                        />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? "max-h-[1000px] mt-4 opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
                        <div className="pl-4 border-l-2 border-[#00c3ff]/30 flex flex-col gap-4 text-base text-gray-700">
                          {item.categories.map((cat, idx) => (
                            <Link
                              key={cat.id || idx}
                              href={cat.href || `/${cat.label.toLowerCase()}`}
                              onClick={closeAllMenus}
                              className="block font-semibold text-gray-600 hover:text-[#00c3ff] hover:pl-2 transition-all duration-300"
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

          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-gray-200/50 pb-6 shrink-0">
            {renderIcons(true)}
          </div>

        </div>
      </div>

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}