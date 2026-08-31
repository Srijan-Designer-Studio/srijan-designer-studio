'use client';

import { useState, useMemo } from 'react';
import { Download, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Card from '@/components/dashboard/shared/Card';
import Filter from '@/components/dashboard/shared/Filter';

export default function ReportsClientWrapper({ initialOrders }) {
  const [timeFilter, setTimeFilter] = useState('year');

  // Dynamically calculate metrics based on real database orders
  const stats = useMemo(() => {
    // Filter to only successful/completed orders
    const validOrders = initialOrders?.filter(o => !['cancelled', 'returned'].includes(o.status)) || [];

    const totalNetRevenue = validOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
    const totalOrderCount = validOrders.length;
    const averageOrderValue = totalOrderCount > 0 ? totalNetRevenue / totalOrderCount : 0;

    // Aggregate monthly revenue for the chart
    const monthMap = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize last 6 months
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthMap[monthNames[d.getMonth()]] = { month: monthNames[d.getMonth()], revenue: 0, orders: 0 };
    }

    validOrders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const mName = monthNames[orderDate.getMonth()];
      if (monthMap[mName]) {
        monthMap[mName].revenue += Number(order.total_amount);
        monthMap[mName].orders += 1;
      }
    });

    return {
      totalNetRevenue,
      averageOrderValue,
      totalOrderCount,
      revenueTrends: Object.values(monthMap)
    };
  }, [initialOrders, timeFilter]);

  const timeFilters = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'This Month', value: 'month' },
    { label: 'Last Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
  ];

  return (
    <div className="space-y-6 font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-[19px] text-gray-500 mt-1">Analyze revenue trends and sales performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
            <Calendar size={16} className="text-gray-400" />
            <span>Updated Today</span>
          </div>
          <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm flex items-center gap-2 transition-colors">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[19px] text-gray-500 uppercase tracking-wider mb-1">Total Net Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalNetRevenue.toLocaleString('en-IN')}</h3>
          </div>
        </Card>
        <Card className="shadow-sm border-gray-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[19px] text-gray-500 uppercase tracking-wider mb-1">Average Order Value</p>
            <h3 className="text-2xl font-bold text-gray-900">₹{stats.averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</h3>
          </div>
        </Card>
        <Card className="shadow-sm border-gray-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[19px] text-gray-500 uppercase tracking-wider mb-1">Total Valid Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrderCount}</h3>
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Revenue Trends</h2>
            <p className="text-[19px] text-gray-500">Monthly breakdown of gross revenue vs order volume.</p>
          </div>
          <Filter options={timeFilters} defaultValue="This Year" onChange={(v) => setTimeFilter(v)} />
        </div>

        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [name === 'revenue' ? `₹${value.toLocaleString()}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#1a1a1a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  );
}
