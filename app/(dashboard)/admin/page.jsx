'use client';

import Image from 'next/image';
import { ArrowUpRight, ArrowDownRight, MoreVertical } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';

export default function AdminDashboard() {
  // --- MOCK DATA FOR CHARTS ---
  const salesData = [
    { date: 'May 06', revenue: 20000, orders: 150 },
    { date: 'May 07', revenue: 35000, orders: 200 },
    { date: 'May 08', revenue: 25000, orders: 180 },
    { date: 'May 09', revenue: 45000, orders: 250 },
    { date: 'May 10', revenue: 30000, orders: 190 },
    { date: 'May 11', revenue: 55000, orders: 300 },
    { date: 'May 12', revenue: 40000, orders: 220 },
  ];

  const revenueData = [
    { name: 'Website', value: 60, color: '#1a1a1a' },
    { name: 'Mobile App', value: 25, color: '#3b82f6' },
    { name: 'Offline', value: 15, color: '#e5e7eb' },
  ];

  const categoryData = [
    { name: 'Lehenga', value: 35, color: '#1a1a1a' },
    { name: 'Saree', value: 25, color: '#3b82f6' },
    { name: 'Anarkali', value: 15, color: '#f59e0b' },
    { name: 'Kurta Sets', value: 15, color: '#10b981' },
    { name: 'Others', value: 10, color: '#e5e7eb' },
  ];

  // --- MOCK DATA FOR LISTS ---
  const topProducts = [
    { id: 1, name: 'Premium Lehenga', sales: '₹45,90,000', orders: '1200 Orders', image: '/images/man1.png' },
    { id: 2, name: 'Silk Saree Collection', sales: '₹32,40,000', orders: '980 Orders', image: '/images/man1.png' },
    { id: 3, name: 'Anarkali Suit Set', sales: '₹28,75,000', orders: '750 Orders', image: '/images/man1.png' },
    { id: 4, name: 'Embroidered Kurta Set', sales: '₹18,60,000', orders: '540 Orders', image: '/images/man1.png' },
  ];

  const recentOrders = [
    { id: '#SRJ12345', customer: 'Ananya Sharma', amount: '₹24,990', payment: 'Paid', status: 'Delivered' },
    { id: '#SRJ12344', customer: 'Riya Patel', amount: '₹8,990', payment: 'Paid', status: 'Shipped' },
    { id: '#SRJ12343', customer: 'Neha Verma', amount: '₹6,490', payment: 'COD', status: 'Processing' },
    { id: '#SRJ12342', customer: 'Priya Singh', amount: '₹4,490', payment: 'Paid', status: 'Cancelled' },
    { id: '#SRJ12341', customer: 'Kavya Mehta', amount: '₹3,990', payment: 'Paid', status: 'Delivered' },
  ];

  const keywords = [
    { word: 'designer lehenga', clicks: '12,540', impressions: '1,25,000', ctr: '10.03%', position: '2.1' },
    { word: 'bridal saree', clicks: '8,230', impressions: '95,000', ctr: '8.66%', position: '3.4' },
    { word: 'party wear anarkali', clicks: '5,100', impressions: '72,000', ctr: '7.08%', position: '4.2' },
  ];

  // --- STAT CARD COMPONENT ---
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

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Row 1: Top Stats (6 columns) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Today's Revenue" value="₹12,45,890" trend="↑ 24.5%" isPositive={true} />
        <StatCard title="Monthly Revenue" value="₹1,25,45,890" trend="↑ 18.6%" isPositive={true} />
        <StatCard title="Today's Orders" value="542" trend="↑ 12.4%" isPositive={true} />
        <StatCard title="Pending Orders" value="86" trend="↓ 5.3%" isPositive={false} />
        <StatCard title="Completed Orders" value="478" trend="↑ 15.9%" isPositive={true} />
        <StatCard title="Return Requests" value="32" trend="↓ 11.2%" isPositive={false} />
      </div>

      {/* Row 2: Sales Chart | Top Products | Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales Overview Line Chart */}
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
              <LineChart data={salesData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
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

        {/* Top Products List */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-900">Top Products</h2>
            <button className="text-xs text-gray-500 hover:text-black">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3">
                <div className="text-xs font-medium text-gray-400 w-3">{product.id}.</div>
                <div className="w-10 h-10 rounded-md overflow-hidden relative flex-shrink-0 bg-gray-100">
                  <Image src={product.image} alt={product.name} fill className="object-cover opacity-80" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-900">{product.sales}</p>
                  <p className="text-[10px] text-gray-500">{product.orders}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <button className="text-xs text-gray-500 hover:text-black">View All</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="min-w-[80px]">
                  <p className="text-[11px] font-medium text-gray-500">{order.id}</p>
                </div>
                <div className="flex-1 min-w-0 px-2">
                  <p className="text-xs font-semibold text-gray-900 truncate">{order.customer}</p>
                </div>
                <div className="w-16 text-right">
                  <p className="text-xs font-bold text-gray-900">{order.amount}</p>
                </div>
                <div className="w-10 text-right">
                  <p className="text-[10px] text-gray-500">{order.payment}</p>
                </div>
                <div className="w-24 flex justify-end">
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Keywords Table | Revenue Donut | Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Search Keywords */}
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
                {keywords.map((kw, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-gray-900">{kw.word}</td>
                    <td className="py-3 text-gray-600">{kw.clicks}</td>
                    <td className="py-3 text-gray-600">{kw.impressions}</td>
                    <td className="py-3 text-gray-600">{kw.ctr}</td>
                    <td className="py-3 text-gray-600">{kw.position}</td>
                    <td className="py-3 text-right">
                      {/* Fake mini trendline SVG */}
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

        {/* Revenue Overview Donut */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Revenue Overview</h2>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
             <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={revenueData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} dataKey="value" stroke="none">
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-500">Total Revenue</span>
                <span className="text-sm font-bold text-gray-900">₹1,25,45,890</span>
             </div>
          </div>
          <div className="flex justify-center gap-4 mt-2 text-[10px]">
            {revenueData.map((d, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                <span className="text-gray-600">{d.name} {d.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category Donut */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Sales by Category</h2>
          <div className="flex-1 flex justify-between items-center gap-4 min-h-[200px]">
             <div className="w-1/2 h-[160px]">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" stroke="none">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="w-1/2 flex flex-col gap-2 text-[10px]">
               {categoryData.map((d, i) => (
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