'use client';

import { useState, Suspense } from 'react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

function OrdersContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    { id: '#ORD-001', customer: 'Rahul Sharma', email: 'rahul@example.com', date: 'Jul 17, 2026', items: 2, amount: '₹14,500', status: 'Pending' },
    { id: '#ORD-002', customer: 'Priya Das', email: 'priya.das@example.com', date: 'Jul 16, 2026', items: 1, amount: '₹35,000', status: 'Processing' },
    { id: '#ORD-003', customer: 'Amit Kumar', email: 'amitk@example.com', date: 'Jul 16, 2026', items: 3, amount: '₹8,400', status: 'Shipped' },
    { id: '#ORD-004', customer: 'Sneha Roy', email: 'sneharoy88@example.com', date: 'Jul 15, 2026', items: 1, amount: '₹12,500', status: 'Delivered' },
    { id: '#ORD-005', customer: 'Vikram Singh', email: 'vikram.s@example.com', date: 'Jul 14, 2026', items: 2, amount: '₹4,200', status: 'Cancelled' },
    { id: '#ORD-006', customer: 'Neha Gupta', email: 'neha_g@example.com', date: 'Jul 14, 2026', items: 1, amount: '₹45,000', status: 'Completed' },
  ];

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const orderColumns = [
    { 
      header: 'Order ID', 
      accessor: 'id', 
      render: (row) => <span className="font-medium text-gray-900">{row.id}</span> 
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
          onClick={() => handleViewOrder(row)}
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

        <Table columns={orderColumns} data={orders} />

        <Pagination />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedOrder ? `Manage Order: ${selectedOrder.id}` : "Order Details"}
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            <button 
              onClick={() => {
                alert("Order status updated!");
                setIsModalOpen(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Update Status
            </button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{selectedOrder.customer}</h4>
                <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                <p className="text-sm text-gray-500 mt-1">Placed on: {selectedOrder.date}</p>
              </div>
              <StatusBadge status={selectedOrder.status} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Order Status</label>
              <select 
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">1x Silk Embroidered Saree (SRJ-001)</span>
                  <span className="font-medium text-gray-900">₹12,500</span>
                </div>
                {selectedOrder.items > 1 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">1x Cotton Block Print Kurta (SRJ-003)</span>
                    <span className="font-medium text-gray-900">₹2,000</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-900">{selectedOrder.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-gray-900">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold mt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{selectedOrder.amount}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}