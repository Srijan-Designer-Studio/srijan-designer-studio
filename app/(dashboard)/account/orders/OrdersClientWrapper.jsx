// OrdersClientWrapper.jsx
'use client';

import { useState } from 'react';
import { Package, Download, Eye, XCircle } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

export default function OrdersClientWrapper({ initialOrders }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      alert('Cancel request initiated for order: ' + orderId);
    }
  };

  const formattedOrders = initialOrders?.map((order) => {
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric'
    }).format(new Date(order.created_at));

    const itemCount = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
    const firstItem = order.order_items?.[0];

    const imageUrl = firstItem?.product_variants?.products?.product_images?.[0]?.image_url || firstItem?.image_url || firstItem?.image || null;

    return {
      rawOrder: order,
      id: order.id.split('-')[0].toUpperCase(),
      date: formattedDate,
      items: `${itemCount} Item${itemCount !== 1 ? 's' : ''}`,
      total: `₹${Number(order.total_amount).toLocaleString('en-IN')}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      image: imageUrl
    };
  }) || [];

  const orderColumns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden shrink-0">
            {row.image ? (
              <img src={row.image} alt="Product" className="w-full h-full object-cover" />
            ) : (
              <Package size={18} className="text-gray-400" />
            )}
          </div>
          <span className="font-bold text-gray-900">#{row.id}</span>
        </div>
      )
    },
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
            onClick={() => { setSelectedOrder(row.rawOrder); setIsModalOpen(true); }}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <Eye size={16} /> View
          </button>
          {row.status === 'Delivered' && (
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors cursor-pointer">
              <Download size={16} /> Invoice
            </button>
          )}
          {(row.status === 'Pending' || row.status === 'Processing') && (
            <button
              onClick={() => handleCancelOrder(row.rawOrder.id)}
              className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            >
              <XCircle size={16} /> Cancel
            </button>
          )}
        </div>
      )
    },
  ];

  const statusOptions = [
    { label: 'All Orders', value: 'all' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Processing', value: 'processing' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="max-w-6xl space-y-6 font-sans pt-28 lg:pt-32">
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
        <Table columns={orderColumns} data={formattedOrders} />
        <Pagination />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedOrder ? `Order Summary: #${selectedOrder.id.split('-')[0].toUpperCase()}` : "Order Details"}
        footer={
          <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 cursor-pointer">
            Close
          </button>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Order Placed</p>
                <p className="font-bold text-gray-900">
                  {new Intl.DateTimeFormat('en-IN').format(new Date(selectedOrder.created_at))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-bold text-[#cfa874] text-lg">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Items in this shipment</h4>

              {selectedOrder.order_items?.map((item, index) => {
                const imgUrl = item.product_variants?.products?.product_images?.[0]?.image_url || item.image_url || item.image || null;

                return (
                  <div key={index} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 border border-gray-100 rounded-md flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                      {imgUrl ? (
                        <Image
                          fill
                          unoptimized
                          src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{item.product_variants?.products?.title || 'Unknown Product'}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.product_variants?.size || 'N/A'}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}