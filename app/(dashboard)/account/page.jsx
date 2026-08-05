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
        const pendingOrders = fetchedOrders.filter(o => o.status === 'pending').length;
        const deliveredOrders = fetchedOrders.filter(o => o.status === 'delivered').length;
        const returnRequests = fetchedOrders.filter(o => o.status === 'returned').length;
        
        const activeTrackingOrder = fetchedOrders.find(o => 
          ['pending', 'processing', 'shipped'].includes(o.status)
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

        setStats({
          firstName: user.user_metadata?.first_name || user.user_metadata?.name?.split(' ')[0] || 'Guest',
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
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#0ba6ff]" />
      </div>
    );
  }

  if (!stats) return null;

  const trackingSteps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = stats.activeTrackingOrder ? trackingSteps.indexOf(stats.activeTrackingOrder.status) : -1;
  const progressPercentage = currentStepIndex >= 0 ? (currentStepIndex / (trackingSteps.length - 1)) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pt-[100px] lg:pt-[120px] px-4 lg:px-8 pb-10">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Welcome back, {stats.firstName} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your account today.</p>
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
            <span className="text-xs font-medium text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
              View All Orders &rarr;
            </Link>
          </div>

          <div className="space-y-6">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">You have no recent orders.</p>
            ) : (
              stats.recentOrders.map((order, idx) => {
                const product = order.order_items?.[0]?.product_variants?.products;
                const statusColors = {
                  pending: 'text-yellow-600 bg-yellow-50',
                  processing: 'text-blue-600 bg-blue-50',
                  shipped: 'text-indigo-600 bg-indigo-50',
                  delivered: 'text-green-600 bg-green-50',
                  cancelled: 'text-red-600 bg-red-50',
                  returned: 'text-orange-600 bg-orange-50'
                };

                return (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                        <Image
                          src={product?.product_images?.[0]?.image_url || '/images/placeholder.jpg'}
                          alt={product?.title || 'Product'}
                          fill
                          unoptimized
                          sizes="48px"
                          className="object-cover opacity-80"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">#{order.id.split('-')[0].toUpperCase()}</p>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product?.title || 'Order Item'}</p>
                        <p className="text-xs font-bold text-gray-900 mt-1">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="text-xs text-gray-500">
                        {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.created_at))}
                      </p>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${statusColors[order.status] || 'text-gray-600 bg-gray-50'}`}>
                        {order.status}
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
                    <p className="text-sm font-bold text-gray-900">#{stats.activeTrackingOrder.id.split('-')[0].toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-bold text-gray-900 capitalize">{stats.activeTrackingOrder.status}</p>
                  </div>
                </div>

                <div className="relative flex justify-between items-center px-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-black -z-10 transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>

                  {['Placed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent = i === currentStepIndex;

                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isCompleted ? 'bg-black text-white' : 'bg-gray-200 text-transparent'}`}>
                          ✓
                        </div>
                        <div className="text-center">
                          <p className={`text-[10px] font-medium ${isCurrent ? 'text-black' : 'text-gray-500'}`}>{step}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">No active orders to track.</p>
                <Link href="/product" className="text-sm font-bold text-[#0ba6ff] hover:underline mt-2 inline-block">Shop Now</Link>
              </div>
            )}
          </div>

          <div className="bg-[#fcf8f2] rounded-2xl border border-[#f0e6d2] p-6 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Save more with Srijan</h3>
              <p className="text-xs text-gray-600 mb-4">Exclusive offers for our members</p>
              <Link href="/product">
                <button className="bg-black text-white text-xs font-bold px-5 py-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-90">
              <Image
                src="/images/man1.png"
                alt="Promo"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}