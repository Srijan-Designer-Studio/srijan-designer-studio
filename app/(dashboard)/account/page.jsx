'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Clock, PackageCheck, Undo2, Heart } from 'lucide-react';

export default function CustomerDashboard() {
  // Dummy data matching your image
  const recentOrders = [
    { id: '#SRJ12345', name: 'Premium Hand Embroidered Lehenga', price: '₹24,990', date: 'May 12, 2024', status: 'Delivered', image: '/images/man1.png', statusColor: 'text-green-600 bg-green-50' },
    { id: '#SRJ12344', name: 'Designer Anarkali Suit', price: '₹8,990', date: 'May 05, 2024', status: 'Shipped', image: '/images/man1.png', statusColor: 'text-blue-600 bg-blue-50' },
    { id: '#SRJ12343', name: 'Silk Saree Collection', price: '₹6,490', date: 'Apr 28, 2024', status: 'Processing', image: '/images/man1.png', statusColor: 'text-yellow-600 bg-yellow-50' },
    { id: '#SRJ12342', name: 'Embroidered Kurta Set', price: '₹4,490', date: 'Apr 20, 2024', status: 'Cancelled', image: '/images/man1.png', statusColor: 'text-red-600 bg-red-50' },
  ];

  return (
   
    <div className="max-w-7xl mx-auto space-y-8 font-sans pt-[100px] lg:pt-[120px] px-4 lg:px-8 pb-10">
      
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Welcome back, Ananya 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">Here's what's happening with your account today.</p>
      </div>

      {/* 5 Stat Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Orders', value: '04', icon: ShoppingBag },
          { label: 'Pending Orders', value: '02', icon: Clock },
          { label: 'Delivered Orders', value: '02', icon: PackageCheck },
          { label: 'Return Requests', value: '01', icon: Undo2 },
          { label: 'Wishlist Items', value: '05', icon: Heart },
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

      {/* Bottom Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Recent Orders (Takes up 3 columns) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
              View All Orders &rarr;
            </Link>
          </div>
          
          <div className="space-y-6">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {/* Product Image Placeholder */}
                  <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
                    <Image src={order.image} alt={order.name} fill className="object-cover opacity-80" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">{order.id}</p>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">{order.name}</p>
                    <p className="text-xs font-bold text-gray-900 mt-1">{order.price}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="text-xs text-gray-500">{order.date}</p>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tracking & Promo (Takes up 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Tracking Component */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Tracking</h2>
            
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-sm font-bold text-gray-900">#SRJ12345</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Estimated Delivery</p>
                <p className="text-sm font-bold text-gray-900">15 May, 2024</p>
              </div>
            </div>

            {/* Custom Stepper/Timeline */}
            <div className="relative flex justify-between items-center px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
              {/* Active Line (Example: 80% complete) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[80%] h-0.5 bg-black -z-10"></div>
              
              {['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'].map((step, i) => {
                const isCompleted = i <= 3; // Shipped is completed
                const isCurrent = i === 3;
                
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isCompleted ? 'bg-black text-white' : 'bg-gray-200 text-transparent'
                    }`}>
                      ✓
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-medium ${isCurrent ? 'text-black' : 'text-gray-500'}`}>{step}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="bg-[#fcf8f2] rounded-2xl border border-[#f0e6d2] p-6 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Save more with Srijan</h3>
              <p className="text-xs text-gray-600 mb-4">Exclusive offers for our members</p>
              <button className="bg-black text-white text-xs font-bold px-5 py-2 rounded-lg hover:bg-gray-800">
                Shop Now
              </button>
            </div>
            {/* Promo Image Placeholder */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-90">
               <Image src="/images/man1.png" alt="Promo" fill className="object-cover" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}