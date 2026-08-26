"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Clock, PackageCheck, Undo2, Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

        const { data: orders } = await supabase
          .from('orders')
          .select(`
            id,
            total_amount,
            status,
            created_at,
            order_items (
              product_variants (
                products (
                  title,
                  product_images (image_url)
                )
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        const fetchedOrders = orders || [];

        const totalOrders = fetchedOrders.length;
        const pendingOrders = fetchedOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;
        const deliveredOrders = fetchedOrders.filter(o => o.status === 'delivered').length;
        const returnRequests = fetchedOrders.filter(o => o.status?.includes('return')).length;

        const activeTrackingOrder = fetchedOrders.find(o =>
          ['pending', 'processing', 'packed', 'shipped', 'out_for_delivery'].includes(o.status)
        );

        let wishlistCount = 0;
        try {
          const { count } = await supabase
            .from('wishlists')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          wishlistCount = count || 0;
        } catch (e) {
          console.log(e);
        }

        let rawName = user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || 'Guest';
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

        setStats({
          firstName: formattedName,
          totalOrders,
          pendingOrders,
          deliveredOrders,
          returnRequests,
          wishlistCount,
          recentOrders: fetchedOrders.slice(0, 5),
          activeTrackingOrder: activeTrackingOrder || null
        });

      } catch (error) {
        console.error(error);
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

  const trackingSteps = ['pending', 'processing', 'shipped', 'delivered'];
  let currentStepIndex = -1;
  
  if (stats.activeTrackingOrder) {
    const status = stats.activeTrackingOrder.status;
    if (status === 'pending') currentStepIndex = 0;
    else if (status === 'processing' || status === 'packed') currentStepIndex = 1;
    else if (status === 'shipped' || status === 'out_for_delivery') currentStepIndex = 2;
    else if (status === 'delivered') currentStepIndex = 3;
  }
  
  const progressPercentage = currentStepIndex >= 0 ? (currentStepIndex / (trackingSteps.length - 1)) * 100 : 0;

  return (
    <div className="w-full space-y-8 font-sans pb-10">

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          Welcome back, {stats.firstName} 👋
        </h1>
        <p className="text-[15px] text-gray-500 mt-1">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders.toString().padStart(2, '0'), icon: ShoppingBag },
          { label: 'Pending Orders', value: stats.pendingOrders.toString().padStart(2, '0'), icon: Clock },
          { label: 'Delivered Orders', value: stats.deliveredOrders.toString().padStart(2, '0'), icon: PackageCheck },
          { label: 'Return Requests', value: stats.returnRequests.toString().padStart(2, '0'), icon: Undo2 },
          { label: 'Wishlist Items', value: stats.wishlistCount.toString().padStart(2, '0'), icon: Heart },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              <stat.icon className="text-[#cfa874]" size={22} strokeWidth={1.5} />
            </div>
            <span className="text-[13px] font-medium text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="space-y-6">
            {stats.recentOrders.length === 0 ? (
              <p className="text-[14px] text-gray-500">You have no recent orders.</p>
            ) : (
              stats.recentOrders.map((order, idx) => {
                const product = order.order_items?.[0]?.product_variants?.products;
                const statusColors = {
                  pending: 'text-yellow-600 bg-yellow-50 border border-yellow-100',
                  processing: 'text-blue-600 bg-blue-50 border border-blue-100',
                  packed: 'text-indigo-600 bg-indigo-50 border border-indigo-100',
                  shipped: 'text-purple-600 bg-purple-50 border border-purple-100',
                  out_for_delivery: 'text-teal-600 bg-teal-50 border border-teal-100',
                  delivered: 'text-green-600 bg-green-50 border border-green-100',
                  cancelled: 'text-red-600 bg-red-50 border border-red-100',
                  returned: 'text-orange-600 bg-orange-50 border border-orange-100'
                };
                
                const displayStatus = order.status ? order.status.replace(/_/g, ' ') : 'Unknown';

                return (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 bg-gray-50 rounded-lg overflow-hidden relative flex-shrink-0 border border-gray-100">
                        <Image
                          src={product?.product_images?.[0]?.image_url || '/images/placeholder.jpg'}
                          alt={product?.title || 'Product'}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[12px] font-mono text-gray-500 mb-0.5">#{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-[15px] font-semibold text-gray-900 line-clamp-1">{product?.title || 'Order Item'}</p>
                        <p className="text-[14px] font-bold text-gray-900 mt-1">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2.5">
                      <p className="text-[13px] text-gray-500 font-medium">
                        {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.created_at))}
                      </p>
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status] || 'text-gray-600 bg-gray-50 border border-gray-200'}`}>
                        {displayStatus}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Tracking</h2>

            {stats.activeTrackingOrder ? (
              <>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[14px] font-mono text-gray-500 mb-1">Order ID</p>
                    <p className="text-[16px] font-bold text-gray-900">#{stats.activeTrackingOrder.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-gray-500 mb-1">Status</p>
                    <p className="text-[14px] font-bold text-[#0ba6ff] capitalize">
                      {stats.activeTrackingOrder.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div className="relative flex justify-between items-center px-2 mt-4">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 -z-10 rounded-full"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#0ba6ff] -z-10 transition-all duration-700 ease-in-out rounded-full" style={{ width: `${progressPercentage}%` }}></div>

                  {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;

                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-sm transition-colors duration-500 ${isCompleted ? 'bg-[#0ba6ff] text-white border-2 border-white' : 'bg-gray-100 text-gray-400 border-2 border-white'}`}>
                          {isCompleted ? '✓' : i + 1}
                        </div>
                        <div className="text-center absolute mt-8">
                          <p className={`text-[11px] font-bold ${isCurrent ? 'text-[#0ba6ff]' : 'text-gray-400'}`}>{step}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="h-8"></div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-[14px] text-gray-500">No active orders to track right now.</p>
                <Link href="/shop-style" className="text-[14px] font-bold text-[#0ba6ff] hover:text-[#0092e6] transition-colors mt-3 inline-block">Shop New Arrivals &rarr;</Link>
              </div>
            )}
          </div>

          <div className="bg-[#121433] rounded-2xl border border-transparent shadow-lg p-6 flex justify-between items-center relative overflow-hidden group cursor-pointer">
            <div className="relative z-10 w-2/3">
              <h3 className="text-lg font-bold text-white mb-1 drop-shadow-md">Save more with Srijan</h3>
              <p className="text-[13px] text-gray-300 mb-5 font-medium">Explore exclusive designer collections.</p>
              <Link href="/shop-style">
                <button className="bg-[#0ba6ff] text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:bg-[#0092e6] transition-colors shadow-md">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <Image
                src="/images/man1.png"
                alt="Promo"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121433] to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}