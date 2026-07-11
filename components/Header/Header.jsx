"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight } from "lucide-react";

import { NAV_DATA, NAV_ICONS } from "@/data/header"; 

export default function Header() {
  // State for top-level dropdowns (e.g., Products)
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // State for second-level nested dropdowns (e.g., Men, Women, Kids)
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Close all menus when a link is clicked
  const closeAllMenus = () => {
    setActiveDropdown(null);
    setActiveSubMenu(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="max-w-[1320px] h-[90px] mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logo1.png" 
            alt="Logo"
            width={200} 
            height={55}
            priority
            className="object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="bg-[#9696a6] px-8 py-3 rounded-full shadow-sm">
          <ul className="flex items-center gap-6 lg:gap-8 text-[15px] font-bold text-white tracking-wide">
            
            {NAV_DATA.map((item) => {
              const isOpen = activeDropdown === item.id;

              return (
                <li
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.id)} 
                  onMouseLeave={() => {
                    setActiveDropdown(null);
                    setActiveSubMenu(null); // Reset sub-menu on mouse leave
                  }} 
                >
                  {/* Items with dropdowns */}
                  {item.categories ? ( 
                    <>
                      <button className="flex items-center gap-1 hover:text-gray-200 transition-colors duration-300">
                        {item.label}
                        <ChevronDown
                          size={16}
                          strokeWidth={2.5}
                          className={`transition transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* 1. NESTED MENU (For Products -> Men/Women/Kids) */}
                      {isOpen && item.type === "nested-menu" && ( 
                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-[18px] z-50">
                          <div className="w-[240px] bg-[#9696a6] text-white border border-white/20 shadow-xl rounded-2xl overflow-visible py-2">
                            
                            {item.categories.map((cat) => (
                              <div
                                key={cat.id}
                                className="relative"
                                onMouseEnter={() => setActiveSubMenu(cat.id)}
                                onMouseLeave={() => setActiveSubMenu(null)}
                              >
                                <button className="w-full flex items-center justify-between px-6 py-3 hover:bg-black/10 transition-colors">
                                  {cat.label}
                                  <ChevronRight size={16} strokeWidth={2.5} />
                                </button>

                                {/* Sub-Menu Flyout (Appears to the right of the parent menu) */}
                                {activeSubMenu === cat.id && (
                                  <div className="absolute left-full top-0 ml-1 w-[240px] bg-[#9696a6] text-white border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2 z-50">
                                    {cat.items.map((subItem, idx) => (
                                      <Link
                                        key={idx}
                                        href={subItem.href}
                                        onClick={closeAllMenus}
                                        className="block px-6 py-3 hover:bg-black/10 transition-colors"
                                      >
                                        {subItem.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}

                          </div>
                        </div>
                      )}

                      {/* 2. SIMPLE DROPDOWN MENU (For Customize) */}
                      {isOpen && item.type === "simple-menu" && ( 
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-[18px] z-50">
                          <div className="w-[240px] bg-[#9696a6] text-white border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
                            {item.categories.map((cat, idx) => (
                              <Link
                                key={idx}
                                href={cat.href}
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
                    /* Normal Link without categories (Home, About, Blog, Contact) */
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

        {/* Icons section */}
        <div className="flex items-center gap-5 shrink-0">
          {NAV_ICONS.map((icon) => ( 
            <img
              key={icon.id} 
              src={icon.src} 
              alt={icon.alt} 
              className="h-10 bg-black p-2 rounded-full w-auto cursor-pointer hover:opacity-75 transition-opacity duration-300" 
            />
          ))}
        </div>

      </div>
    </header>
  );
}