'use client';

import { useState, useEffect, useTransition } from 'react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';
import { getAllOrders, updateOrderStatus } from '@/app/actions/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStatus = formData.get('status');

    startTransition(async () => {
      await updateOrderStatus(selectedOrder.id, newStatus);
      const updatedData = await getAllOrders();
      setOrders(updatedData);
      setIsModalOpen(false);
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const formattedOrders = orders.map(order => ({
    rawOrder: order,
    id: order.id.split('-')[0].toUpperCase(),
    customer: `${order.profiles?.first_name || 'Guest'} ${order.profiles?.last_name || ''}`,
    email: order.profiles?.auth_users?.email || 'N/A',
    date: new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.created_at)),
    items: order.order_items ? order.order_items.length : 0,
    amount: `₹${Number(order.total_amount).toLocaleString('en-IN')}`,
    status: order.status.charAt(0).toUpperCase() + order.status.slice(1)
  }));

  const orderColumns = [
    { 
      header: 'Order ID', 
      accessor: 'id', 
      render: (row) => <span className="font-medium text-gray-900">#{row.id}</span> 
    },
    { header: 'Date', accessor: 'date' },
    { 
      header: 'Customer', 
      accessor: 'customer',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900">{row.customer}</p>
          <p className="text-xs text-gray-500">{row.email}</p>
        </div>
      )
    },
    { 
      header: 'Items', 
      accessor: 'items',
      render: (row) => <span className="text-gray-600">{row.items} items</span>
    },
    { 
      header: 'Total Amount', 
      accessor: 'amount',
      render: (row) => <span className="font-medium text-gray-900">{row.amount}</span>
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status} /> 
    },
    { 
      header: 'Actions', 
      accessor: 'action', 
      render: (row) => (
        <button 
          onClick={() => handleViewOrder(row.rawOrder)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
        >
          Manage
        </button>
      ) 
    },
  ];

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track, manage, and fulfill customer orders.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      <Card className="p-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white">
          <Search placeholder="Search by Order ID, Customer, or Email..." />
          <div className="w-full sm:w-auto">
            <Filter options={statusOptions} defaultValue="All Statuses" />
          </div>
        </div>
        <Table columns={orderColumns} data={formattedOrders} />
        <Pagination />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedOrder ? `Manage Order: #${selectedOrder.id.split('-')[0].toUpperCase()}` : "Order Details"}
      >
        {selectedOrder && (
          <form onSubmit={handleStatusUpdate} className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{selectedOrder.profiles?.first_name} {selectedOrder.profiles?.last_name}</h4>
                <p className="text-sm text-gray-500">{selectedOrder.profiles?.auth_users?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Placed on: {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(selectedOrder.created_at))}
                </p>
              </div>
              <StatusBadge status={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Order Status</label>
              <select 
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                defaultValue={selectedOrder.status.toLowerCase()}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-3">
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.product_variants?.products?.title} ({item.product_variants?.sku})</span>
                    <span className="font-medium text-gray-900">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">₹{Number(selectedOrder.shipping_fee || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{(Number(selectedOrder.total_amount) + Number(selectedOrder.shipping_fee || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Close
              </button>
              <button 
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70"
              >
                {isPending ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}