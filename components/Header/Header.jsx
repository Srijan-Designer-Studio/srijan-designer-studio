// components/Header.jsx

"use client";

import { useState, useEffect } from "react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [headerState, setHeaderState] = useState("top");

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      if (currentScroll > 300) setHeaderState("scrolled");
      else if (currentScroll > 100) setHeaderState("hidden");
      else setHeaderState("top");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

      const iconSize = isMobile ? "w-11 h-11" : "w-10 h-10 lg:w-11 lg:h-11";
      const imgSize = isMobile ? "w-5 h-5" : "w-5 h-5 lg:w-5 lg:h-5";

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
            <div className={`${iconSize} bg-black rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shadow-sm`}>
              {isSearch ? (
                <Search size={isMobile ? 22 : 20} className="text-white" strokeWidth={2.5} />
              ) : (
                <img src={icon.src} alt={icon.alt} className={`${imgSize} object-contain`} />
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
          <div className={`${iconSize} bg-black rounded-full flex items-center justify-center group-hover:bg-gray-600 transition-colors shadow-sm`}>
            <img src={icon.src} alt={icon.alt} className={`${imgSize} object-contain`} />
          </div>
        </Link>
      );
    });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 ease-in-out lg:bg-transparent lg:shadow-none lg:border-none ${
          headerState === "top" && !isMobileMenuOpen ? "bg-transparent" : "bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200/50"
        } ${headerState === "hidden" ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="max-w-[1320px] h-[90px] lg:h-[90px] mx-auto px-4 lg:px-6 flex items-center justify-between">
          <Link href="/" className="z-50" onClick={closeAllMenus}>
            <Image
              src="/images/logo3.png"
              alt="Logo"
              width={130}
              height={40}
              priority
              className="object-cover bg-center lg:w-[250px] lg:h-[120px]"
            />
          </Link>

          <nav className="hidden lg:block bg-[#9696a6]/60 backdrop-blur-md border border-white/20 px-8 py-3 rounded-full shadow-lg">
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
                    {item.isMegaMenu ? (
                      <>
                        <button className="flex items-center gap-1 hover:text-gray-200 transition-colors duration-300 cursor-pointer">
                          {item.label}
                          <ChevronDown
                            size={16}
                            strokeWidth={2.5}
                            className={`transition transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-[18px] z-50 transition-all duration-300 ease-out origin-top ${isOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible translate-y-4 scale-95"}`}>
                          <div className="w-[600px] bg-white rounded-lg text-black shadow-2xl flex border border-gray-100 cursor-default">
                            <div className="flex-1 p-8 border-r border-gray-100">
                              <h3 className="text-[13px] font-extrabold tracking-wide mb-6 uppercase text-gray-900">
                                {item.leftColumn.title}
                              </h3>
                              <ul className="flex flex-col gap-4">
                                {item.leftColumn.links.map((link, idx) => (
                                  <li key={idx}>
                                    <Link
                                      href={link.href}
                                      onClick={closeAllMenus}
                                      className="text-gray-600 text-[14px] hover:text-[#00c3ff] transition-colors font-medium"
                                    >
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex-1 p-8 bg-[#fafafa] flex flex-col items-center justify-center text-center">
                              <h3 className="text-[13px] font-extrabold tracking-wide mb-3 uppercase text-gray-900">
                                {item.rightColumn.title}
                              </h3>
                              <p className="text-gray-500 text-[13px] leading-relaxed mb-6 font-medium">
                                {item.rightColumn.description}
                              </p>
                              <Link
                                href={item.rightColumn.buttonLink}
                                onClick={closeAllMenus}
                                className="bg-black text-white text-[13px] rounded-lg font-bold px-6 py-3 hover:bg-[#00c3ff] transition-colors"
                              >
                                {item.rightColumn.buttonText}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : item.categories ? (
                      <>
                        <button className="flex items-center gap-1 hover:text-gray-200 transition-colors duration-300 cursor-pointer">
                          {item.label}
                          <ChevronDown
                            size={16}
                            strokeWidth={2.5}
                            className={`transition transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-[18px] z-50 transition-all duration-300 ease-out origin-top ${isOpen ? "opacity-100 visible translate-y-0 scale-100" : "opacity-0 invisible translate-y-4 scale-95"}`}>
                          <div className="w-[200px] bg-white text-gray-800 shadow-xl rounded-lg border border-gray-100 py-3">
                            {item.categories.map((cat, idx) => (
                              <Link
                                key={cat.id || idx}
                                href={cat.href || `/${cat.label.toLowerCase()}`}
                                onClick={closeAllMenus}
                                className="block px-6 py-3 text-[14px] font-medium hover:text-[#00c3ff] transition-colors"
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
            <div className="hidden lg:flex items-center gap-4 lg:gap-5">
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
        style={{ top: "90px" }}
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
                  {item.isMegaMenu ? (
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
                          <span className="font-bold text-gray-900 text-sm mt-2">{item.leftColumn.title}</span>
                          {item.leftColumn.links.map((link, idx) => (
                            <Link
                              key={idx}
                              href={link.href}
                              onClick={closeAllMenus}
                              className="block font-semibold hover:text-[#00c3ff]"
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

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}