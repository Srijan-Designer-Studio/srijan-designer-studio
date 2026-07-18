'use client';

import { useState } from 'react';
import { Package, Download, Eye } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

export default function CustomerOrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock full order history
  const orders = [
    { id: '#SRJ12345', date: 'May 12, 2024', items: '1 Item', total: '₹24,990', status: 'Delivered' },
    { id: '#SRJ12344', date: 'May 05, 2024', items: '2 Items', total: '₹8,990', status: 'Shipped' },
    { id: '#SRJ12343', date: 'Apr 28, 2024', items: '1 Item', total: '₹6,490', status: 'Processing' },
    { id: '#SRJ12342', date: 'Apr 20, 2024', items: '3 Items', total: '₹4,490', status: 'Cancelled' },
    { id: '#SRJ11900', date: 'Jan 15, 2024', items: '1 Item', total: '₹35,000', status: 'Delivered' },
    { id: '#SRJ11850', date: 'Dec 10, 2023', items: '2 Items', total: '₹12,500', status: 'Delivered' },
  ];

  const orderColumns = [
    { header: 'Order ID', accessor: 'id', render: (row) => <span className="font-bold text-gray-900">{row.id}</span> },
    { header: 'Date', accessor: 'date' },
    { header: 'Items', accessor: 'items', render: (row) => <span className="text-gray-500">{row.items}</span> },
    { header: 'Total Amount', accessor: 'total', render: (row) => <span className="font-bold text-gray-900">{row.total}</span> },
    { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
    { 
      header: 'Actions', 
      accessor: 'action', 
      render: (row) => (
        <div className="flex gap-3">
          <button 
            onClick={() => { setSelectedOrder(row); setIsModalOpen(true); }}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Eye size={16} /> View
          </button>
          {row.status === 'Delivered' && (
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              <Download size={16} /> Invoice
            </button>
          )}
        </div>
      ) 
    },
  ];

  const statusOptions = [
    { label: 'Delivered', value: 'delivered' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Processing', value: 'processing' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="max-w-6xl pt-[100px] lg:pt-[120px space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">Track, return, or download invoices for your past purchases.</p>
        </div>
      </div>

      <Card className="p-0 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <Search placeholder="Search by Order ID..." />
          <Filter options={statusOptions} defaultValue="All Orders" />
        </div>
        <Table columns={orderColumns} data={orders} />
        <Pagination />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedOrder ? `Order Summary: ${selectedOrder.id}` : "Order Details"}
        footer={
          <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
            Close
          </button>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
             <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Order Placed</p>
                  <p className="font-bold text-gray-900">{selectedOrder.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="font-bold text-[#cfa874] text-lg">{selectedOrder.total}</p>
                </div>
             </div>
             
             {/* Mock Items list inside modal */}
             <div className="border border-gray-100 rounded-xl p-4">
                <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-50 pb-2">Items in this shipment</h4>
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                      <Package size={24} />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">Premium Hand Embroidered Lehenga</p>
                      <p className="text-xs text-gray-500">Qty: 1 | Size: M</p>
                   </div>
                   <p className="text-sm font-bold text-gray-900">₹24,990</p>
                </div>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}