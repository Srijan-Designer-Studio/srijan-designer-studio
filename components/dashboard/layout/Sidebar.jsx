'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, User, ShoppingBag, MapPin,
  Heart, Star, Lock, LogOut, Package, Users,
  BarChart, Tag, Search, Home, FileText, TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      const fetchOrderCount = async () => {
        try {
          const supabase = createClient();
          const { count, error } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true });
          
          if (!error && count !== null) {
            setOrderCount(count);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchOrderCount();
    }
  }, [isAdmin]);

  const customerLinks = [
    { name: 'Dashboard', href: '/account', icon: LayoutDashboard },
    { name: 'Profile', href: '/account/profile', icon: User },
    { name: 'Orders', href: '/account/orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/account/wishlist', icon: Heart },
    { name: 'Reviews', href: '/account/reviews', icon: Star },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Change Password', href: '/account/security', icon: Lock },
  ];

  const adminLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: orderCount.toString() },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Custom Requests', href: '/admin/custom-requests', icon: Star },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Reports', href: '/admin/reports', icon: BarChart },
    { name: 'Search Keywords', href: '/admin/keywords', icon: Search },
  ];

  const links = isAdmin ? adminLinks : customerLinks;

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error(error);
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <aside 
      className={`w-64 flex flex-col hidden md:flex transition-colors duration-300 ${
        isAdmin 
          ? 'bg-[#fff] text-gray-700' 
          : 'bg-white text-gray-600 border-r border-gray-200'
      }`}
    >
      <div className={`h-24 flex items-center justify-center px-6 shrink-0 ${
        isAdmin ? 'border-b border-white/5' : 'border-b border-gray-100'
      }`}>
        <Link href="/">
          <Image
            src="/images/logo3.png"
            alt="SRIJAN Logo"
            width={180}
            height={90}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-1.5">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isAdmin
                        ? 'bg-black text-[#cfa874] shadow-md'
                        : 'bg-black text-white shadow-md'
                      : isAdmin
                        ? 'hover:text-[#cfa874] hover:bg-white/5'
                        : 'hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <link.icon size={18} className={isActive && isAdmin ? 'text-[#cfa874]' : ''} />
                    {link.name}
                  </div>
                  {link.badge && link.badge !== '0' && (
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

      <div className="p-4 mb-4 shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors cursor-pointer ${
            isAdmin ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}