"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Clock, PackageCheck, Undo2, Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getUserOrders } from '@/app/actions/orders';

export default function CustomerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        const fetchedOrders = await getUserOrders() || [];

        const totalOrders = fetchedOrders.length;
        const pendingOrders = fetchedOrders.filter(o => (o.status || '').toLowerCase() === 'pending' || (o.status || '').toLowerCase() === 'processing').length;
        const deliveredOrders = fetchedOrders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
        const returnRequests = fetchedOrders.filter(o => (o.status || '').toLowerCase().includes('return')).length;

        let wishlistCount = 0;
        try {
          const { count } = await supabase
            .from('wishlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          wishlistCount = count || 0;
        } catch (e) {}

        let rawName = user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || 'Guest';
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

        setStats({
          firstName: formattedName,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          returnRequests,
          wishlistCount,
          recentOrders: fetchedOrders.slice(0, 5)
        });

      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#0ba6ff]" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-[100px] lg:pt-[120px] space-y-6 sm:space-y-8 font-sans pb-10">

      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-2">
          Welcome back, {stats.firstName} 👋
        </h1>
        <p className="text-[14px] sm:text-[15px] text-gray-500 mt-1 sm:mt-2">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders.toString().padStart(2, '0'), icon: ShoppingBag },
          { label: 'Pending Orders', value: stats.pendingOrders.toString().padStart(2, '0'), icon: Clock },
          { label: 'Delivered', value: stats.deliveredOrders.toString().padStart(2, '0'), icon: PackageCheck },
          { label: 'Returns', value: stats.returnRequests.toString().padStart(2, '0'), icon: Undo2 },
          { label: 'Wishlist', value: stats.wishlistCount.toString().padStart(2, '0'), icon: Heart, fullWidth: true },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-24 sm:h-28 hover:shadow-md transition-shadow ${stat.fullWidth ? 'col-span-2 lg:col-span-1' : ''}`}>
            <div className="flex justify-between items-start">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</span>
              <stat.icon className="text-[#cfa874] w-5 h-5 sm:w-[22px] sm:h-[22px]" strokeWidth={2} />
            </div>
            <span className="text-[12px] sm:text-[13px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 overflow-hidden">
          <div className="flex justify-between items-center mb-5 sm:mb-6 border-b border-gray-50 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-[12px] sm:text-sm font-bold text-[#0ba6ff] hover:text-[#0092e6] flex items-center gap-1 transition-colors">
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-4 sm:space-y-5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
            {stats.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <ShoppingBag className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium">You have no recent orders.</p>
              </div>
            ) : (
              stats.recentOrders.map((order, idx) => {
                const firstItem = order.order_items?.[0];
                const title = firstItem?.product_variants?.products?.title || 'Order Item';
                const imageUrl = firstItem?.image_url || '/images/placeholder.jpg';
                
                const statusColors = {
                  pending: 'text-yellow-700 bg-yellow-50 border border-yellow-200',
                  processing: 'text-blue-700 bg-blue-50 border border-blue-200',
                  packed: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
                  shipped: 'text-purple-700 bg-purple-50 border border-purple-200',
                  out_for_delivery: 'text-teal-700 bg-teal-50 border border-teal-200',
                  delivered: 'text-green-700 bg-green-50 border border-green-200',
                  cancelled: 'text-red-700 bg-red-50 border border-red-200',
                  returned: 'text-orange-700 bg-orange-50 border border-orange-200'
                };
                const displayStatus = order.status ? order.status.replace(/_/g, ' ') : 'Unknown';

                return (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-16 sm:w-14 sm:h-16 bg-white rounded-lg overflow-hidden relative shrink-0 border border-gray-200">
                        <Image src={imageUrl} alt="Product" fill unoptimized className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">#{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-[13px] sm:text-[14px] font-bold text-gray-900 line-clamp-1">{title}</p>
                        <p className="text-[13px] sm:text-[14px] font-black text-[#cfa874] mt-0.5">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-200 pt-2 sm:pt-0 mt-1 sm:mt-0 w-full sm:w-auto">
                      <p className="text-[11px] sm:text-[12px] text-gray-500 font-bold mb-0 sm:mb-1.5">
                        {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.created_at))}
                      </p>
                      <span className={`text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded shadow-sm uppercase tracking-wider ${statusColors[order.status] || 'text-gray-600 bg-gray-50 border border-gray-200'}`}>
                        {displayStatus}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-black rounded-2xl shadow-lg p-5 sm:p-6 flex justify-between items-center relative overflow-hidden group cursor-pointer border border-gray-800 h-full min-h-[250px]">
            <div className="relative z-10 w-2/3 sm:w-[60%]">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">Elevate Your<br/>Wardrobe</h3>
              <p className="text-[12px] sm:text-[13px] text-gray-400 mb-6 font-medium pr-2">Explore our latest exclusive designer collections.</p>
              <Link href="/shop-style">
                <button className="bg-white text-black text-[12px] sm:text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-md uppercase tracking-wider">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-[45%] opacity-70 group-hover:opacity-100 transition-opacity duration-500">
              <Image src="/images/man1.png" alt="Promo" fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}