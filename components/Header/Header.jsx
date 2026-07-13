"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

import { NAV_DATA, NAV_ICONS } from "@/data/header";

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

  const closeAllMenus = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    setMobileActiveDropdown(null);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileDropdown = (id) => {
    if (mobileActiveDropdown === id) {
      setMobileActiveDropdown(null);
    } else {
      setMobileActiveDropdown(id);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md lg:bg-transparent lg:shadow-none transition-all duration-300">
      <div className="max-w-[1320px] h-[70px] lg:h-[90px] mx-auto px-4 lg:px-6 flex items-center justify-between">
        <Link href="/" className="z-50" onClick={closeAllMenus}>
          <Image
            src="/images/logo1.png"
            alt="Logo"
            width={160}
            height={45}
            priority
            className="object-cover lg:w-[200px] lg:h-[55px]"
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
                          className={`transition transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-[18px] z-50">
                          <div className="w-[240px] bg-[#9696a6] text-white border border-white/20 shadow-xl rounded-2xl overflow-hidden py-2">
                            {item.categories.map((cat, idx) => (
                              <Link
                                key={idx}
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
          <div className="flex items-center gap-2 lg:gap-5">
            {NAV_ICONS.map((icon) => (
              <img
                key={icon.id}
                src={icon.src}
                alt={icon.alt}
                className="h-8 lg:h-10 bg-black p-1.5 lg:p-2 rounded-full w-auto cursor-pointer hover:opacity-75 transition-opacity duration-300"
              />
            ))}
          </div>

          <button
            className="lg:hidden text-black p-1 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: "70px" }}
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
                          className={`transition-transform duration-300 ${
                            isDropdownOpen ? "rotate-180 text-[#00c3ff]" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isDropdownOpen ? "max-h-screen mt-4" : "max-h-0"
                        }`}
                      >
                        <div className="pl-4 border-l-2 border-[#00c3ff]/30 flex flex-col gap-4 text-base text-gray-700">
                          {item.categories.map((cat, idx) => (
                            <Link
                              key={idx}
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
  );
}