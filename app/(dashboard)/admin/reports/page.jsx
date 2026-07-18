'use client';

import { Download, Calendar, TrendingUp, MapPin, DollarSign } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import Filter from '@/components/dashboard/shared/Filter';

export default function AdminReportsPage() {
  // --- MOCK DATA ---
  const revenueTrends = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 130 },
    { month: 'Apr', revenue: 61000, orders: 170 },
    { month: 'May', revenue: 59000, orders: 160 },
    { month: 'Jun', revenue: 75000, orders: 210 },
    { month: 'Jul', revenue: 82000, orders: 240 },
  ];

  const regionalSales = [
    { id: 1, region: 'Maharashtra', revenue: '₹14,50,000', orders: 450, growth: '+12.5%' },
    { id: 2, region: 'Delhi NCR', revenue: '₹12,20,000', orders: 380, growth: '+8.2%' },
    { id: 3, region: 'West Bengal', revenue: '₹9,80,000', orders: 310, growth: '+15.4%' },
    { id: 4, region: 'Karnataka', revenue: '₹8,45,000', orders: 260, growth: '-2.1%' },
    { id: 5, region: 'Gujarat', revenue: '₹6,30,000', orders: 195, growth: '+5.7%' },
  ];

  const regionColumns = [
    { 
      header: 'Region / State', 
      accessor: 'region', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-400" />
          <span className="font-semibold text-gray-900">{row.region}</span>
        </div>
      ) 
    },
    { header: 'Total Orders', accessor: 'orders' },
    { header: 'Revenue Generated', accessor: 'revenue', render: (row) => <span className="font-bold text-gray-900">{row.revenue}</span> },
    { 
      header: 'Growth (MoM)', 
      accessor: 'growth', 
      render: (row) => (
        <span className={`font-medium ${row.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {row.growth}
        </span>
      ) 
    },
  ];

  const timeFilters = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'This Month', value: 'month' },
    { label: 'Last Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Analyze revenue trends, sales performance, and regional data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
            <Calendar size={16} className="text-gray-400" />
            <span>Jan 1, 2024 - Jul 17, 2026</span>
          </div>
          <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm flex items-center gap-2 transition-colors">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Net Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">₹84,25,000</h3>
          </div>
        </Card>
        <Card className="shadow-sm border-gray-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Average Order Value</p>
            <h3 className="text-2xl font-bold text-gray-900">₹14,580</h3>
          </div>
        </Card>
        <Card className="shadow-sm border-gray-100 flex items-center gap-4 p-6">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Conversion Rate</p>
            <h3 className="text-2xl font-bold text-gray-900">3.24%</h3>
          </div>
        </Card>
      </div>

      {/* Main Revenue Chart */}
      <Card className="p-6 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Revenue Trends</h2>
            <p className="text-xs text-gray-500">Monthly breakdown of gross revenue vs order volume.</p>
          </div>
          <Filter options={timeFilters} defaultValue="This Year" />
        </div>
        
        <div className="w-full h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value, name) => [name === 'revenue' ? `₹${value.toLocaleString()}` : value, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#1a1a1a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Regional Sales Table */}
      <Card className="p-0 shadow-sm border-gray-100">
        <div className="p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <h2 className="text-base font-bold text-gray-900">Sales by Region</h2>
          <p className="text-xs text-gray-500">Top performing states and territories.</p>
        </div>
        <Table columns={regionColumns} data={regionalSales} />
      </Card>

    </div>
  );
}