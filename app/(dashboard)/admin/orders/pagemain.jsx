'use client';

import { useState, useEffect, useTransition } from 'react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';
import { getAllOrders, updateOrderStatus, pushOrderToShiprocket, requestPickup, generateLabel, generateInvoice, cancelShipment, initiateReturn } from '@/app/actions/admin';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [isPushing, setIsPushing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

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

  const handleShiprocketSync = async () => {
    setIsPushing(true);
    try {
      const result = await pushOrderToShiprocket(selectedOrder.id);
      if (result.success) {
        alert("Order successfully pushed to Shiprocket!");
        const updatedData = await getAllOrders();
        setOrders(updatedData);
        setSelectedOrder(updatedData.find(o => o.id === selectedOrder.id) || selectedOrder);
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setIsPushing(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const orderId = order.id?.toLowerCase() || "";
    const customerName = `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.toLowerCase();
    const email = (order.profiles?.email || '').toLowerCase();

    const matchesSearch = !query || orderId.includes(query) || customerName.includes(query) || email.includes(query);
    const matchesStatus = statusFilter === "All Statuses" || order.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const formattedOrders = filteredOrders.map(order => ({
    rawOrder: order,
    id: order.id.split('-')[0].toUpperCase(),
    customer: `${order.profiles?.first_name || 'Guest'} ${order.profiles?.last_name || ''}`.trim(),
    email: order.profiles?.email || 'N/A',
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
          <p className="text-[19px] text-gray-500">{row.email}</p>
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
          className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors cursor-pointer"
        >
          Manage
        </button>
      )
    },
  ];

  const statusOptions = [
    { label: 'All Statuses', value: 'All Statuses' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Returned', value: 'returned' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[400px] w-full flex flex-col items-center justify-center space-y-5">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
          Loading Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-[19px] text-gray-500 mt-1">Track, manage, and fulfill customer orders.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
      </div>

      <Card className="p-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white text-black">

          <div className="relative w-full sm:w-[400px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by Order ID, Customer, or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black bg-gray-50/50 transition-all"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-black bg-white cursor-pointer transition-all"
            >
              {statusOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>{opt.label}</option>
              ))}
            </select>
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
                <p className="text-[19px] text-gray-500">{selectedOrder.profiles?.email}</p>
                <p className="text-[19px] text-gray-500 mt-1">
                  Placed on: {new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(selectedOrder.created_at))}
                </p>
              </div>
              <StatusBadge status={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Order Status</label>
              <select
                name="status"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white text-sm cursor-pointer"
                defaultValue={selectedOrder.status.toLowerCase()}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="returned">Returned</option>
              </select>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
              <div className="space-y-3">
                {selectedOrder.order_items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.product_variants?.products?.title} ({item.product_variants?.sku})</span>
                    <span className="font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
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

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 mt-4">
              {selectedOrder.shiprocket_order_id ? (
                <div className="flex flex-wrap gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <span className="w-full text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1">
                    Shiprocket Actions (AWB: {selectedOrder.tracking_number || 'Pending'})
                  </span>

                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'returned' && (
                    <>
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await requestPickup(selectedOrder.shiprocket_shipment_id);
                          if (res.success) alert("Pickup scheduled successfully!");
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors cursor-pointer"
                      >
                        Schedule Pickup
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const res = await generateLabel(selectedOrder.shiprocket_shipment_id);
                          if (res.success && res.data.label_created) {
                            window.open(res.data.label_url, '_blank');
                          } else {
                            alert("Could not generate label.");
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md border border-indigo-200 hover:bg-indigo-200 transition-colors cursor-pointer"
                      >
                        Download Label
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      const res = await generateInvoice(selectedOrder.shiprocket_order_id);
                      if (res.success && res.data.is_invoice_created) {
                        window.open(res.data.invoice_url, '_blank');
                      } else {
                        alert("Could not generate invoice.");
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-md border border-indigo-200 hover:bg-indigo-200 transition-colors cursor-pointer"
                  >
                    Download Invoice
                  </button>

                  {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'returned' && (
                    <button
                      type="button"
                      onClick={async () => {
                        const confirmCancel = window.confirm("Are you sure you want to cancel this shipment in Shiprocket?");
                        if (confirmCancel) {
                          const res = await cancelShipment(selectedOrder.id, selectedOrder.tracking_number);
                          if (res.success) {
                            alert("Shipment cancelled.");
                            const updatedData = await getAllOrders();
                            setOrders(updatedData);
                            setIsModalOpen(false);
                          } else {
                            alert("Failed to cancel.");
                          }
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md border border-red-200 hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      Cancel Shipment
                    </button>
                  )}

                  {selectedOrder.status === 'delivered' && (
                    <button
                      type="button"
                      onClick={async () => {
                        const confirmReturn = window.confirm("Create a return pickup for this order?");
                        if (confirmReturn) {
                          const res = await initiateReturn(selectedOrder.id);
                          if (res.success) {
                            alert("Return pickup scheduled successfully!");
                            const updatedData = await getAllOrders();
                            setOrders(updatedData);
                            setIsModalOpen(false);
                          } else {
                            alert("Failed to create return.");
                          }
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-orange-700 bg-orange-100 rounded-md border border-orange-200 hover:bg-orange-200 transition-colors cursor-pointer"
                    >
                      Initiate Return
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleShiprocketSync}
                  disabled={isPushing || selectedOrder.status === 'cancelled' || selectedOrder.status === 'returned'}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                >
                  {isPushing ? 'Pushing...' : 'Push to Shiprocket'}
                </button>
              )}

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-70 cursor-pointer"
                >
                  {isPending ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}