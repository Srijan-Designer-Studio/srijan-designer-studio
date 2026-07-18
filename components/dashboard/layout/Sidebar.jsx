'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, User, ShoppingBag, MapPin,
  Heart, Star, Lock, LogOut, Package, Users,
  BarChart, Tag, Search
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // --- CUSTOMER LINKS ---
  const customerLinks = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Orders', href: '/account/orders', icon: ShoppingBag },
    { name: 'Track Order', href: '/account/track', icon: MapPin },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Reviews', href: '/account/reviews', icon: Star },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Change Password', href: '/account/security', icon: Lock },
  ];

  // --- ADMIN LINKS ---
  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '15' },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Reports', href: '/admin/reports', icon: BarChart },
    { name: 'Search Keywords', href: '/admin/keywords', icon: Search },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  return (
    <aside className={`w-64 flex flex-col hidden md:flex transition-colors duration-300 ${isAdmin ? 'bg-[#1a1a1a] text-gray-300' : 'bg-white text-gray-600 border-r border-gray-200'
      }`}>
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-center px-6 border-b border-white/5">
        <h2 className={`text-2xl font-serif tracking-wider ${isAdmin ? 'text-[#cfa874]' : 'text-[#8b7355]'}`}>
          SRIJAN
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                      ? isAdmin
                        ? 'bg-black text-[#cfa874] shadow-md' // Admin Active
                        : 'bg-black text-white shadow-md' // Customer Active
                      : isAdmin
                        ? 'hover:text-[#cfa874] hover:bg-white/5' // Admin Hover
                        : 'hover:text-black hover:bg-gray-50' // Customer Hover
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} className={isActive && isAdmin ? 'text-[#cfa874]' : ''} />
                    {link.name}
                  </div>
                  {link.badge && (
                    <span className="bg-[#2a2a2a] text-white text-[10px] px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 mb-4">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })} // 2. Eta use koro
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${isAdmin ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
            }`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}