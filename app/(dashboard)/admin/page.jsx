"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import { getDashboardStats } from '@/app/actions/admin';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    recentOrders: [],
    salesData: [],
    revenueData: [],
    categoryData: [],
    topProducts: [],
    keywords: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, trend, isPositive }) => (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">{value}</h3>
      <p className="text-xs text-gray-500 mb-3">{title}</p>
      <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        {isPositive ? <ArrowUpRight size={14} className="mr-1"/> : <ArrowDownRight size={14} className="mr-1"/>}
        {trend}
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} trend="Live" isPositive={true} />
        <StatCard title="Total Orders" value={stats.totalOrders} trend="Live" isPositive={true} />
        <StatCard title="Total Customers" value={stats.totalCustomers} trend="Live" isPositive={true} />
        <StatCard title="Pending Orders" value={stats.recentOrders.filter(o => o.status === 'pending').length} trend="Live" isPositive={false} />
        <StatCard title="Completed Orders" value={stats.recentOrders.filter(o => o.status === 'delivered').length} trend="Live" isPositive={true} />
        <StatCard title="Active Products" value={stats.topProducts.length} trend="Live" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-900">Sales Overview</h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-blue-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Revenue</span>
              <span className="flex items-center gap-1 text-yellow-500"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Orders</span>
            </div>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.salesData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#eab308" strokeWidth={3} dot={{ r: 4, fill: '#eab308', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-900">Top Products</h2>
            <button className="text-xs text-gray-500 hover:text-black">View All</button>
          </div>
          <div className="space-y-4">
            {stats.topProducts.slice(0, 4).map((product, idx) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="text-xs font-medium text-gray-400 w-3">{idx + 1}.</div>
                <div className="w-10 h-10 rounded-md overflow-hidden relative flex-shrink-0 bg-gray-100">
                  <Image src={product.image || '/images/placeholder.jpg'} alt={product.name} fill className="object-cover opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">₹{product.revenue?.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-gray-500">{product.sales} Orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <button className="text-xs text-gray-500 hover:text-black">View All</button>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div className="min-w-[80px]">
                  <p className="text-[11px] font-medium text-gray-500">#{order.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div className="flex-1 min-w-0 px-2">
                  <p className="text-xs font-semibold text-gray-900 truncate">{order.profiles?.first_name} {order.profiles?.last_name}</p>
                </div>
                <div className="w-16 text-right">
                  <p className="text-xs font-bold text-gray-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</p>
                </div>
                <div className="w-24 flex justify-end">
                  <StatusBadge status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-6">Search Keywords (GA4 / Search Console)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="pb-3 font-medium">Keyword</th>
                  <th className="pb-3 font-medium">Clicks</th>
                  <th className="pb-3 font-medium">Impressions</th>
                  <th className="pb-3 font-medium">CTR</th>
                  <th className="pb-3 font-medium">Avg. Position</th>
                  <th className="pb-3 font-medium text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.keywords.map((kw, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-gray-900">{kw.word}</td>
                    <td className="py-3 text-gray-600">{kw.clicks}</td>
                    <td className="py-3 text-gray-600">{kw.impressions}</td>
                    <td className="py-3 text-gray-600">{kw.ctr}</td>
                    <td className="py-3 text-gray-600">{kw.position}</td>
                    <td className="py-3 text-right">
                      <svg width="40" height="15" viewBox="0 0 40 15" fill="none" className="inline-block">
                        <path d="M0 10 Q 10 15, 20 5 T 40 2" stroke="#3b82f6" strokeWidth="1.5" fill="none"/>
                      </svg>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Revenue Overview</h2>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
             <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={stats.revenueData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
                    {stats.revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-500">Total Revenue</span>
                <span className="text-sm font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
             </div>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px]">
            {stats.revenueData.map((d, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-gray-600">{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Sales by Category</h2>
          <div className="flex-1 flex justify-between items-center gap-4 min-h-[200px]">
             <div className="w-1/2 h-[160px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                      {stats.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="w-1/2 flex flex-col gap-2 text-[10px]">
               {stats.categoryData.map((d, i) => (
                <div key={i} className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span className="text-gray-600">{d.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">{d.value}%</span>
                </div>
              ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}