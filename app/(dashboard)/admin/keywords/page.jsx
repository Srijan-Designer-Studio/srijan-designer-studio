'use client';

import { useState } from 'react';
import { Plus, TrendingUp, BarChart3, Search as SearchIcon } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';

export default function AdminKeywordsPage() {
  const [keywords] = useState([
    { keyword: 'Silk Saree', searches: 1250, conversion: '3.2%', status: 'Active' },
    { keyword: 'Embroidered Lehenga', searches: 890, conversion: '2.8%', status: 'Active' },
    { keyword: 'Designer Suit', searches: 720, conversion: '1.5%', status: 'Active' },
    { keyword: 'Party Wear Gown', searches: 500, conversion: '0.5%', status: 'Paused' },
    { keyword: 'Cotton Kurta', searches: 340, conversion: '4.1%', status: 'Active' },
  ]);

  const columns = [
    { header: 'Keyword', accessor: 'keyword', render: (row) => <span className="font-semibold text-gray-900">{row.keyword}</span> },
    { header: 'Monthly Searches', accessor: 'searches', render: (row) => <span className="text-gray-600">{row.searches.toLocaleString()}</span> },
    { header: 'Conversion Rate', accessor: 'conversion', render: (row) => <span className="font-medium text-green-600">{row.conversion}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: () => <button className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">Edit</button> 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO & Search Keywords</h1>
          <p className="text-sm text-gray-500">Manage site search performance and keywords.</p>
        </div>
        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800">
          <Plus size={16} /> Add Keyword
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs text-gray-500">Total Search Volume</p>
            <h3 className="text-xl font-bold">3,700</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={24} /></div>
          <div>
            <p className="text-xs text-gray-500">Avg. Conversion</p>
            <h3 className="text-xl font-bold">2.42%</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><SearchIcon size={24} /></div>
          <div>
            <p className="text-xs text-gray-500">Active Keywords</p>
            <h3 className="text-xl font-bold">4</h3>
          </div>
        </Card>
      </div>

      <Card className="p-0 shadow-sm">
        <Table columns={columns} data={keywords} />
      </Card>
    </div>
  );
}