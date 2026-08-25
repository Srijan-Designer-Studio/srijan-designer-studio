'use client';

import { useState, useTransition } from 'react';
import { Plus, TrendingUp, BarChart3, Search as SearchIcon, Loader2, Edit2, Trash2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Modal from '@/components/dashboard/shared/Modal';
import { addKeyword, getKeywords, updateKeyword, deleteKeyword } from '@/app/actions/keywords';

export default function KeywordsClientWrapper({ initialKeywords }) {
  const [keywords, setKeywords] = useState(initialKeywords || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ keyword: '', searches: 0, conversion: 0, status: 'Active' });
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const totalSearches = keywords.reduce((sum, k) => sum + (k.searches || 0), 0);
  const activeKeywords = keywords.filter(k => k.is_active).length;

  const avgConversion = keywords.length > 0
    ? (keywords.reduce((sum, k) => sum + Number(k.conversion_rate || 0), 0) / keywords.length).toFixed(2)
    : '0.00';

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ keyword: '', searches: 0, conversion: 0, status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (k) => {
    setEditingId(k.id);
    setFormData({
      keyword: k.keyword,
      searches: k.searches,
      conversion: k.conversion_rate,
      status: k.is_active ? 'Active' : 'Inactive'
    });
    setIsModalOpen(true);
  };

  const executeDelete = (id) => {
    setDeletingId(id);
    startTransition(async () => {
      try {
        await deleteKeyword(id);
        const updatedData = await getKeywords();
        setKeywords(updatedData);
      } catch (error) {
        alert("Failed to delete keyword.");
      } finally {
        setDeletingId(null);
        setConfirmDelete(null);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData(e.target);

    startTransition(async () => {
      try {
        if (editingId) {
          await updateKeyword(editingId, submitData);
        } else {
          await addKeyword(submitData);
        }
        const updatedData = await getKeywords();
        setKeywords(updatedData);
        setIsModalOpen(false);
      } catch (error) {
        alert("Failed to save keyword.");
      }
    });
  };

  const formattedKeywords = keywords.map(k => ({
    id: k.id,
    raw: k,
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
      render: (row) => (
        <div className="flex items-center gap-3">
          <button onClick={() => openEditModal(row.raw)} className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer" title="Edit">
            <Edit2 size={16} />
          </button>
          <button onClick={() => setConfirmDelete(row.raw)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer" title="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO & Search Keywords</h1>
          <p className="text-[19px] text-gray-500 mt-1">Manage site search performance and monitor top keywords.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} /> Add Keyword
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4 border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <p className="text-[19px] text-gray-500 uppercase tracking-wider mb-1">Total Search Volume</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalSearches.toLocaleString()}</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-gray-100 shadow-sm">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><BarChart3 size={24} /></div>
          <div>
            <p className="text-[19px] text-gray-500 uppercase tracking-wider mb-1">Avg. Conversion</p>
            <h3 className="text-2xl font-bold text-gray-900">{avgConversion}%</h3>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4 border-gray-100 shadow-sm">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><SearchIcon size={24} /></div>
          <div>
            <p className="text-[19px] text-gray-500 uppercase tracking-wider mb-1">Active Keywords</p>
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
        title={editingId ? "Edit SEO Keyword" : "Add SEO Keyword"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
            <input
              name="keyword"
              required
              type="text"
              value={formData.keyword}
              onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
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
                value={formData.searches}
                onChange={(e) => setFormData({ ...formData, searches: e.target.value })}
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
                value={formData.conversion}
                onChange={(e) => setFormData({ ...formData, conversion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black/5 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select 
              name="status" 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-black/5 outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer">Cancel</button>
            <button disabled={isPending} type="submit" className="px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg disabled:opacity-70 flex items-center gap-2 cursor-pointer">
              {isPending && <Loader2 size={16} className="animate-spin" />} {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16.5C2.57 18.333 3.532 20 5.072 20z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 text-center mb-1">Delete Keyword?</h2>
            <p className="text-[19px] text-gray-500 text-center mb-6 leading-relaxed">
              <span className="font-medium text-gray-700">"{confirmDelete.keyword}"</span> will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={!!deletingId}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => executeDelete(confirmDelete.id)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {deletingId === confirmDelete.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}