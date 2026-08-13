


"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X, Search } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";

import { NAV_DATA, NAV_ICONS } from "@/data/header";

import CartDrawer from "@/components/cart/CartDrawer";
import WishlistDrawer from "@/components/wishlist/WishlistDrawer";
import SearchDrawer from "@/components/search/SearchDrawer";

export default function Header({ initialUser = null }) {
  const { cartItems, wishlistItems, isLoaded } = useCart();
  const [user, setUser] = useState(initialUser);
  const [status, setStatus] = useState(initialUser ? "authenticated" : "unauthenticated");

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeTab, setActiveTab] = useState("women");
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
    setActiveTab("women");
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

      const iconContainerSize = isMobile ? "w-11 h-11" : "w-[50px] h-[50px]";
      const iconSize = isMobile ? "w-5 h-5" : "w-[22px] h-[22px]";

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
            <div className={`${iconContainerSize} bg-black rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shadow-sm`}>
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
          <div className={`${iconContainerSize} bg-black rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shadow-sm`}>
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
          
          <Link href="/" className="z-50" onClick={closeAllMenus}>
            <Image
              src="/images/logo3.png"
              alt="Logo"
              width={250}
              height={120}
              priority
              className="object-cover bg-center h-[90px] w-auto lg:h-[120px] lg:w-[250px]"
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
                    onMouseLeave={() => { setActiveDropdown(null); setActiveTab("women"); }}
                  >
                    
                    {item.isTabbedMegaMenu ? (
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
                          <div className="w-[850px] bg-white rounded-xl text-black shadow-2xl flex border border-gray-100 cursor-default overflow-hidden">
                            
                            <div className="w-[220px] bg-white p-4 flex flex-col gap-2">
                              {item.tabs.map((tab) => {
                                const currentTab = activeTab || item.tabs[0].id;
                                const isActive = currentTab === tab.id;
                                return (
                                  <div
                                    key={tab.id}
                                    onMouseEnter={() => setActiveTab(tab.id)} 
                                    className={`text-left px-5 py-3.5 rounded-lg font-bold text-[15px] transition-all duration-200 cursor-pointer ${
                                      isActive 
                                        ? "bg-black text-white shadow-md" 
                                        : "text-gray-700 hover:text-black"
                                    }`}
                                  >
                                    {tab.label}
                                  </div>
                                );
                              })}
                            </div>

                            <div className="flex-1 flex bg-white border-l border-gray-100">
                              {item.tabs.map((tab) => {
                                const currentTab = activeTab || item.tabs[0].id;
                                if (currentTab !== tab.id) return null;
                                
                                return (
                                  <div key={tab.id} className="flex flex-1 w-full animate-in fade-in duration-300">
                                    
                                    <div className="flex-1 p-8 border-r border-gray-100">
                                      <h3 className="text-[14px] font-extrabold tracking-wide mb-6 uppercase text-gray-900">
                                        {tab.leftColumn.title}
                                      </h3>
                                      <ul className="flex flex-col gap-5">
                                        {tab.leftColumn.links.map((link, idx) => (
                                          <li key={idx}>
                                            <Link
                                              href={link.href}
                                              onClick={closeAllMenus}
                                              className="inline-block text-gray-600 text-[15px] font-medium transition-all duration-300 hover:text-[#00c3ff] hover:translate-x-2"
                                            >
                                              {link.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    <div className="flex-1 p-8 bg-[#fafafa] flex flex-col items-center justify-center text-center">
                                      <h3 className="text-[14px] font-extrabold tracking-wide mb-3 uppercase text-gray-900">
                                        {tab.rightColumn.title}
                                      </h3>
                                      <p className="text-gray-500 text-[13px] leading-relaxed mb-6 font-medium px-2">
                                        {tab.rightColumn.description}
                                      </p>
                                      <Link
                                        href={tab.rightColumn.buttonLink}
                                        onClick={closeAllMenus}
                                        className="inline-block bg-black text-white text-[13px] rounded-lg font-bold px-8 py-3.5 transition-all duration-300 hover:bg-[#00c3ff] hover:shadow-lg hover:-translate-y-1"
                                      >
                                        {tab.rightColumn.buttonText}
                                      </Link>
                                    </div>
                                    
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : item.isMegaMenu ? (
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
                          <div className="w-[600px] bg-white rounded-xl text-black shadow-2xl flex border border-gray-100 cursor-default overflow-hidden">
                            <div className="flex-1 p-8 border-r border-gray-100">
                              <h3 className="text-[14px] font-extrabold tracking-wide mb-6 uppercase text-gray-900">
                                {item.leftColumn.title}
                              </h3>
                              <ul className="flex flex-col gap-5">
                                {item.leftColumn.links.map((link, idx) => (
                                  <li key={idx}>
                                    <Link
                                      href={link.href}
                                      onClick={closeAllMenus}
                                      className="inline-block text-gray-600 text-[15px] font-medium transition-all duration-300 hover:text-[#00c3ff] hover:translate-x-2"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex-1 p-8 bg-[#fafafa] flex flex-col items-center justify-center text-center">
                              <h3 className="text-[14px] font-extrabold tracking-wide mb-3 uppercase text-gray-900">
                                {item.rightColumn.title}
                              </h3>
                              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 font-medium px-2">
                                {item.rightColumn.description}
                              </p>
                              <Link
                                href={item.rightColumn.buttonLink}
                                onClick={closeAllMenus}
                                className="inline-block bg-black text-white text-[13px] rounded-lg font-bold px-8 py-3.5 transition-all duration-300 hover:bg-[#00c3ff] hover:shadow-lg hover:-translate-y-1"
                              >
                                {item.rightColumn.buttonText}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : item.categories ? (
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
                          <div className="w-[200px] bg-white text-gray-800 shadow-xl rounded-lg border border-gray-100 py-3">
                            {item.categories.map((cat, idx) => (
                              <Link
                                key={cat.id || idx}
                                href={cat.href || `/${cat.label.toLowerCase()}`}
                                onClick={closeAllMenus}
                                className="block px-6 py-3 text-[14px] font-medium transition-all duration-300 hover:text-[#00c3ff] hover:pl-8"
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
        className={`fixed inset-0 bg-white/80 backdrop-blur-xl z-[80] transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ top: "80px" }}
      >
        <div className="p-6 pb-24">
          
          <div className="flex items-center justify-around gap-2 mb-6 border-b border-gray-200/50 pb-6">
            {renderIcons(true)}
          </div>

          <ul className="flex flex-col gap-5 text-[17px] font-bold text-gray-900">
            {NAV_DATA.map((item) => {
              const isDropdownOpen = mobileActiveDropdown === item.id;
              return (
                <li key={item.id} className="border-b border-gray-200/50 pb-4">
                  {item.isTabbedMegaMenu ? (
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
                      <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? "max-h-[2000px] mt-4 opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
                        <div className="pl-4 border-l-2 border-[#00c3ff]/30 flex flex-col gap-4 text-base text-gray-700">
                          {item.tabs.map((tab, tIdx) => {
                            const isInnerOpen = activeTab === tab.id;
                            return (
                              <div key={tab.id} className={tIdx > 0 ? "pt-3 border-t border-gray-200/50" : ""}>
                                <button
                                  onClick={() => setActiveTab(isInnerOpen ? null : tab.id)}
                                  className="w-full flex items-center justify-between font-extrabold text-black text-[14px] uppercase"
                                >
                                  {tab.label}
                                  <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-300 ${isInnerOpen ? "rotate-180 text-[#00c3ff]" : ""}`}
                                  />
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${isInnerOpen ? "max-h-[1000px] mt-3 opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
                                  <div className="flex flex-col gap-3 pl-2 mb-4">
                                    {tab.leftColumn.links.map((link, idx) => (
                                      <Link
                                        key={idx}
                                        href={link.href}
                                        onClick={closeAllMenus}
                                        className="block font-medium text-gray-600 hover:text-[#00c3ff] hover:pl-2 transition-all duration-300"
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>

                                  <div className="pl-2 bg-gray-50 p-4 rounded-lg">
                                    <span className="font-bold text-gray-900 text-[13px] block mb-2 uppercase">{tab.rightColumn.title}</span>
                                    <p className="text-gray-500 text-[12px] mb-3 leading-relaxed">{tab.rightColumn.description}</p>
                                    <Link
                                      href={tab.rightColumn.buttonLink}
                                      onClick={closeAllMenus}
                                      className="inline-block bg-black text-white text-[12px] font-bold px-4 py-2 hover:bg-[#00c3ff] transition-colors rounded"
                                    >
                                      {tab.rightColumn.buttonText}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : item.isMegaMenu ? (
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
                          <span className="font-bold text-gray-900 text-sm mt-2">{item.leftColumn.title}</span>
                          {item.leftColumn.links.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.href}
                              onClick={closeAllMenus}
                              className="block font-semibold text-gray-600 hover:text-[#00c3ff] hover:pl-2 transition-all duration-300"
                            >
                              {link.label}
                            </Link>
                          ))}
                          <div className="mt-2 pt-4 border-t border-gray-200/50">
                            <span className="font-bold text-gray-900 text-sm block mb-3">{item.rightColumn.title}</span>
                            <Link
                              href={item.rightColumn.buttonLink}
                              onClick={closeAllMenus}
                              className="inline-block bg-black text-white text-[12px] font-bold px-4 py-2 hover:bg-[#00c3ff] transition-colors"
                            >
                              {item.rightColumn.buttonText}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : item.categories ? (
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
                      <div className={`overflow-hidden transition-all duration-300 ${isDropdownOpen ? "max-h-screen mt-4 opacity-100 visible" : "max-h-0 opacity-0 invisible"}`}>
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
        </div>
      </div>

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}