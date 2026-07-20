'use client';

import { useState, useTransition } from 'react';
import { Plus, TrendingUp, BarChart3, Search as SearchIcon, Loader2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Modal from '@/components/dashboard/shared/Modal';
import { addKeyword, getKeywords } from '@/app/actions/keywords';

export default function KeywordsClientWrapper({ initialKeywords }) {
  const [keywords, setKeywords] = useState(initialKeywords || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Dynamic calculations based on DB data
  const totalSearches = keywords.reduce((sum, k) => sum + (k.searches || 0), 0);
  const activeKeywords = keywords.filter(k => k.is_active).length;
  
  const avgConversion = keywords.length > 0 
    ? (keywords.reduce((sum, k) => sum + Number(k.conversion_rate || 0), 0) / keywords.length).toFixed(2)
    : '0.00';

  const handleAddKeyword = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        await addKeyword(formData);
        const updatedData = await getKeywords();
        setKeywords(updatedData);
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
        alert("Failed to add keyword.");
      }
    });
  };

  const formattedKeywords = keywords.map(k => ({
    id: k.id,
    keyword: k.keyword,
    searches: k.searches,
    conversion: `${k.conversion_rate}%`,
    status: k.is_active ? 'Active' : 'Inactive'
  }));

  const columns = [
    { header: 'Keyword', accessor: 'keyword', render: (row) => <span className="font-semibold text-gray-900">{row.keyword}</span> },
    { header: 'Monthly Searches', accessor: 'searches', render: (row) => <span className="text-gray-600">{row.searches.toLocaleString()}</span> },
    { header: 'Conversion Rate', accessor: 'conversion', render: (row) => <span className="font-medium text-green-600">{row.conversion}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { 
      header: 'Actions', 
      accessor: 'actions', 
      render: () => <button className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors">Edit</button> 
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO & Search Keywords</h1>
          <p className="text-sm text-gray-500 mt-1">Manage site search performance and monitor top keywords.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Keyword
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Search Volume</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalSearches.toLocaleString()}</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-gray-100 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Avg. Conversion</p>
            <h3 className="text-2xl font-bold text-gray-900">{avgConversion}%</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-gray-100 shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><SearchIcon size={24} /></div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Active Keywords</p>
            <h3 className="text-2xl font-bold text-gray-900">{activeKeywords}</h3>
          </div>
        </Card>
      </div>

      <Card className="p-0 shadow-sm border-gray-100 overflow-hidden">
        {keywords.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No keywords tracked yet. Add one to get started.</div>
        ) : (
          <Table columns={columns} data={formattedKeywords} />
        )}
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add SEO Keyword"
      >
        <form onSubmit={handleAddKeyword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
            <input 
              name="keyword" 
              required 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black/5 outline-none" 
              placeholder="e.g. Silk Saree" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Searches</label>
              <input 
                name="searches" 
                required 
                type="number" 
                defaultValue="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black/5 outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Conversion (%)</label>
              <input 
                name="conversion" 
                required 
                type="number" 
                step="0.1"
                defaultValue="0.0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black/5 outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-black/5 outline-none">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Cancel</button>
            <button disabled={isPending} type="submit" className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg disabled:opacity-70 flex items-center gap-2">
              {isPending && <Loader2 size={16} className="animate-spin" />} Save Keyword
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}