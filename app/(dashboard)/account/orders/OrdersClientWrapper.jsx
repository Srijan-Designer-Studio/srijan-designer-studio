'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Eye, XCircle, Star, RotateCcw, Loader2, CheckCircle } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';
import DownloadInvoice from '@/components/ui/DownloadInvoice';
import { updateOrderUserAction } from '@/app/actions/orders';

export default function OrdersClientWrapper({ initialOrders }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', orderId: null, title: '', message: '' });
  const [feedbackDialog, setFeedbackDialog] = useState({ isOpen: false, type: 'success', message: '' });

  const handleCancelOrder = (orderId) => {
    setConfirmDialog({
      isOpen: true,
      type: 'cancelled',
      orderId: orderId,
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order? This action cannot be undone.'
    });
  };

  const handleReturnOrder = (orderId) => {
    setConfirmDialog({
      isOpen: true,
      type: 'return_requested',
      orderId: orderId,
      title: 'Request Return',
      message: 'Are you sure you want to request a return for this order? Our team will review your request.'
    });
  };

  const handleConfirmAction = async () => {
    setIsUpdating(true);
    const res = await updateOrderUserAction(confirmDialog.orderId, confirmDialog.type);

    setConfirmDialog({ isOpen: false, type: '', orderId: null, title: '', message: '' });

    if (res?.success) {
      setFeedbackDialog({ isOpen: true, type: 'success', message: res.message || 'Action completed successfully!' });
      setIsModalOpen(false); 
    } else {
      setFeedbackDialog({ isOpen: true, type: 'error', message: res?.message || 'Failed to complete action.' });
    }
    
    setIsUpdating(false);
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
      status: order.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedOrder(row.rawOrder); setIsModalOpen(true); }}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <Eye size={16} /> View
          </button>

          {row.status === 'Delivered' && (
            <>
              <DownloadInvoice order={row.rawOrder} />
              
              <button
                onClick={() => { setSelectedOrder(row.rawOrder); setIsModalOpen(true); }}
                className="flex items-center gap-1 text-sm font-bold text-yellow-600 hover:text-yellow-700 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Star size={16} className="fill-yellow-600" /> Review
              </button>

              <button
                onClick={() => handleReturnOrder(row.rawOrder.id)}
                disabled={isUpdating}
                className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:text-orange-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RotateCcw size={16} /> Return
              </button>
            </>
          )}

          {(row.status === 'Pending' || row.status === 'Processing') && (
            <button
              onClick={() => handleCancelOrder(row.rawOrder.id)}
              disabled={isUpdating}
              className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
    <div className="max-w-7xl mx-auto space-y-6 font-sans pt-28 lg:pt-32 px-4 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-[16px] text-gray-500 mt-1">Track, return, or download invoices for your past purchases.</p>
        </div>
      </div>

      <Card className="p-0 shadow-sm border-gray-100 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl min-w-[800px]">
          <Search placeholder="Search by Order ID..." />
          <Filter options={statusOptions} defaultValue="All Orders" />
        </div>
        <div className="min-w-[800px]">
          <Table columns={orderColumns} data={formattedOrders} />
        </div>
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
                <p className="text-[14px] text-gray-500">Order Placed</p>
                <p className="font-bold text-gray-900">
                  {new Intl.DateTimeFormat('en-IN').format(new Date(selectedOrder.created_at))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[14px] text-gray-500">Total Amount</p>
                <p className="font-bold text-[#cfa874] text-lg">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl p-4 space-y-4">
              <h4 className="text-sm font-bold text-gray-900 border-b border-gray-50 pb-2">Items in this shipment</h4>

              {selectedOrder.order_items?.map((item, index) => {
                const product = item.product_variants?.products || item.products || item;
                const imgUrl = product?.product_images?.[0]?.image_url || item.image_url || item.image || null;
                const productSlug = product?.slug;

                return (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-24 bg-gray-100 border border-gray-100 rounded-md flex items-center justify-center text-gray-400 overflow-hidden shrink-0 relative">
                      {imgUrl ? (
                        <Image
                          fill
                          unoptimized
                          src={imgUrl} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} />
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[15px] font-bold text-gray-900 leading-tight pr-2">{product?.title || item.title || 'Unknown Product'}</p>
                        <p className="text-[16px] font-bold text-gray-900 whitespace-nowrap">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      <p className="text-[13px] text-gray-500 mb-3">Qty: {item.quantity} | Size: {item.product_variants?.size || item.size || 'N/A'}</p>

                      {(selectedOrder.status || '').toLowerCase() === 'delivered' && productSlug && (
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <Link
                            href={`/product/${productSlug}`}
                            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-1.5 rounded-md transition-colors shadow-sm"
                          >
                            <Star size={12} className="fill-white" /> Write Review
                          </Link>
                          
                          <button
                            onClick={() => handleReturnOrder(selectedOrder.id)}
                            disabled={isUpdating}
                            className="inline-flex items-center gap-1.5 text-[12px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-1.5 rounded-md transition-colors border border-orange-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <RotateCcw size={12} /> Return Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 border-t border-gray-100 justify-end">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, type: '', orderId: null, title: '', message: '' })}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer disabled:opacity-50"
              >
                No, Keep it
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isUpdating}
                className={`px-4 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 ${confirmDialog.type === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {isUpdating && <Loader2 size={14} className="animate-spin" />}
                Yes, {confirmDialog.type === 'cancelled' ? 'Cancel' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackDialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 p-6 text-center">
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 ${feedbackDialog.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
              {feedbackDialog.type === 'success' ? <CheckCircle size={28} /> : <XCircle size={28} />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {feedbackDialog.type === 'success' ? 'Success!' : 'Oops!'}
            </h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{feedbackDialog.message}</p>
            <button
              onClick={() => setFeedbackDialog({ isOpen: false, type: 'success', message: '' })}
              className="w-full py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 cursor-pointer transition-colors"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}