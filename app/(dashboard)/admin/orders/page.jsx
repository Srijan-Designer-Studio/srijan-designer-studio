'use client';

import { useState, useEffect, useTransition } from 'react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Modal from '@/components/dashboard/shared/Modal';
import { getAllOrders, updateOrderStatus, pushOrderToShiprocket, requestPickup, generateLabel, generateInvoice, cancelShipment, initiateReturn } from '@/app/actions/admin';
import { MapPin, User, Package, Calendar, CreditCard, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [isPushing, setIsPushing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

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
                const updatedData = await getAllOrders();
                setOrders(updatedData);
                setSelectedOrder(updatedData.find(o => o.id === selectedOrder.id) || selectedOrder);
            }
        } finally {
            setIsPushing(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const formatAddress = (order) => {
        const addr = order.address || order.shipping_address;
        if (!addr) return "Address not provided";
        if (typeof addr === 'string') {
            try {
                const parsed = JSON.parse(addr);
                return `${parsed.addressLine1 || ''} ${parsed.addressLine2 || ''}, ${parsed.city || ''}, ${parsed.state || ''} - ${parsed.zip || ''}`;
            } catch (e) {
                return addr;
            }
        }
        return `${addr.addressLine1 || ''} ${addr.addressLine2 || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.zip || ''}`;
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

    const totalItems = filteredOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFilteredOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    const currentOrders = currentFilteredOrders.map(order => ({
        rawOrder: order,
        id: order.id.split('-')[0].toUpperCase(),
        customer: `${order.profiles?.first_name || 'Guest'} ${order.profiles?.last_name || ''}`.trim(),
        email: order.profiles?.email || 'N/A',
        date: new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.created_at)),
        items: order.order_items ? order.order_items.length : 0,
        amount: `₹${Number(order.total_amount).toLocaleString('en-IN')}`,
        status: order.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    }));

    const orderColumns = [
        { header: 'Order ID', accessor: 'id', render: (row) => <span className="font-medium text-gray-900">#{row.id}</span> },
        { header: 'Date', accessor: 'date' },
        {
            header: 'Customer',
            accessor: 'customer',
            render: (row) => (
                <div>
                    <p className="font-medium text-gray-900">{row.customer}</p>
                    <p className="text-[13px] text-gray-500">{row.email}</p>
                </div>
            )
        },
        { header: 'Items', accessor: 'items', render: (row) => <span className="text-gray-600">{row.items} items</span> },
        { header: 'Total Amount', accessor: 'amount', render: (row) => <span className="font-medium text-gray-900">{row.amount}</span> },
        { header: 'Status', accessor: 'status', render: (row) => <StatusBadge status={row.status} /> },
        {
            header: 'Actions',
            accessor: 'action',
            render: (row) => (
                <button
                    onClick={() => handleViewOrder(row.rawOrder)}
                    className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors cursor-pointer bg-blue-50 px-3 py-1.5 rounded-md"
                >
                    Manage Details
                </button>
            )
        },
    ];

    const statusOptions = [
        { label: 'All Statuses', value: 'All Statuses' },
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Packed', value: 'packed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Out for Delivery', value: 'out_for_delivery' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Return Requested', value: 'return_requested' },
        { label: 'Return Approved', value: 'return_approved' },
        { label: 'Return Rejected', value: 'return_rejected' },
        { label: 'Refund Initiated', value: 'refund_initiated' },
        { label: 'Returned', value: 'returned' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-[400px] w-full flex flex-col items-center justify-center space-y-5">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-[16px] text-gray-500 mt-1">Track, manage, and fulfill customer orders seamlessly.</p>
                </div>
            </div>

            <Card className="p-0 shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-gray-100 bg-white text-black">
                    <div className="relative w-full sm:w-[400px]">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by Order ID, Customer, or Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-black bg-gray-50 transition-all"
                        />
                    </div>

                    <div className="w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-black bg-gray-50 cursor-pointer transition-all"
                        >
                            {statusOptions.map((opt, idx) => (
                                <option key={idx} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto min-w-[800px]">
                    <Table columns={orderColumns} data={currentOrders} />
                </div>

                {totalPages > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-end px-6 py-4 bg-white border-t border-gray-100">
                        <div className="inline-flex -space-x-px rounded-md shadow-sm">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center justify-center px-3 py-2 text-gray-400 bg-white border border-gray-200 rounded-l-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 text-sm font-bold border focus:outline-none transition-colors cursor-pointer ${currentPage === page
                                            ? 'bg-blue-600 text-white border-blue-600 z-10 relative shadow-sm'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center justify-center px-3 py-2 text-gray-400 bg-white border border-gray-200 rounded-r-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer focus:outline-none"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedOrder ? `Order ID: #${selectedOrder.id.split('-')[0].toUpperCase()}` : "Order Details"}
            >
                {selectedOrder && (
                    <form onSubmit={handleStatusUpdate} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User size={14} /> Customer Details
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-bold text-gray-900">{selectedOrder.profiles?.first_name} {selectedOrder.profiles?.last_name}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">Email:</span> <span className="font-medium text-gray-900">{selectedOrder.profiles?.email}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">Customer ID:</span> <span className="font-mono text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{selectedOrder.user_id.split('-')[0]}</span></p>
                                    <p className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-900">{new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(selectedOrder.created_at))}</span></p>
                                    {selectedOrder.customer_phone && (
                                        <p className="flex justify-between"><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{selectedOrder.customer_phone}</span></p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={14} /> Shipping & Payment
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <p className="text-gray-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-gray-200/60 shadow-sm">
                                        {formatAddress(selectedOrder)}
                                    </p>

                                    <div className="flex flex-col gap-2 mt-3 bg-white p-3 rounded-lg border border-gray-200/60 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Method:</span>
                                            <span className={`font-bold px-2 py-0.5 rounded text-xs uppercase flex items-center gap-1 ${selectedOrder.payment_method === 'cod' ? 'text-orange-700 bg-orange-100' : 'text-green-700 bg-green-100'}`}>
                                                <CreditCard size={12} /> {selectedOrder.payment_method === 'cod' ? 'COD' : 'ONLINE'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Status:</span>
                                            <span className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase ${selectedOrder.payment_status === 'Paid' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                                {selectedOrder.payment_status || 'Pending'}
                                            </span>
                                        </div>
                                        {selectedOrder.payment_method === 'online' && selectedOrder.razorpay_payment_id && (
                                            <div className="pt-2 mt-1 border-t border-gray-100 space-y-1.5">
                                                <p className="flex justify-between items-center"><span className="text-[11px] text-gray-500 uppercase tracking-wider">Pay ID:</span> <span className="font-mono text-xs text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">{selectedOrder.razorpay_payment_id}</span></p>
                                                <p className="flex justify-between items-center"><span className="text-[11px] text-gray-500 uppercase tracking-wider">Order ID:</span> <span className="font-mono text-xs text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">{selectedOrder.razorpay_order_id}</span></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Package size={14} /> Products Ordered ({selectedOrder.order_items?.length})
                                </h3>
                            </div>
                            <div className="p-5 space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar">
                                {selectedOrder.order_items?.map((item, idx) => {
                                    let imageUrl = "";
                                    const images = item.product_variants?.products?.product_images;
                                    if (Array.isArray(images) && images.length > 0) {
                                        imageUrl = typeof images[0] === 'string' ? images[0] : (images[0]?.image_url || "");
                                    }

                                    let metaSize = null;
                                    try {
                                        const addrData = typeof selectedOrder.shipping_address === 'string' ? JSON.parse(selectedOrder.shipping_address) : (selectedOrder.shipping_address || selectedOrder.address);
                                        if (addrData && addrData.cart_meta) {
                                            const metaObj = addrData.cart_meta.find(m => m.id === item.variant_id);
                                            if (metaObj) metaSize = metaObj.size;
                                        }
                                    } catch (err) { }

                                    const displaySize = metaSize || item.product_variants?.size || "-";
                                    const displayColor = item.product_variants?.color || "-";

                                    return (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg border border-gray-200">

                                            <div
                                                className={`relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200 shrink-0 shadow-sm flex items-center justify-center ${imageUrl ? 'cursor-pointer group' : ''}`}
                                                onClick={() => imageUrl && setEnlargedImage(imageUrl)}
                                            >
                                                <Package size={24} className="text-gray-400 absolute z-0" />
                                                {imageUrl && (
                                                    <img
                                                        src={imageUrl}
                                                        alt={item.product_variants?.products?.title || "Product"}
                                                        className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.product_variants?.products?.title || "Unknown Product"}</h4>
                                                <p className="text-[13px] text-gray-500 mt-1">SKU: {item.product_variants?.sku || "N/A"}</p>
                                                <p className="text-[13px] font-semibold text-gray-700 mt-1">
                                                    Size/Color: <span className="uppercase">{displaySize} | {displayColor}</span>
                                                </p>
                                            </div>
                                            <div className="text-left sm:text-right shrink-0">
                                                <p className="text-[13px] text-gray-500 mb-1">Qty: <span className="font-bold text-black">{item.quantity}</span></p>
                                                <p className="text-[15px] font-black text-[#0ba6ff]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="bg-gray-50 p-5 border-t border-gray-200 space-y-2 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium text-gray-900">₹{Number(selectedOrder.total_amount).toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className="font-medium text-gray-900">₹{Number(selectedOrder.shipping_fee || 0).toLocaleString('en-IN')}</span></div>
                                <div className="flex justify-between text-base font-black pt-2 border-t border-gray-200 mt-2">
                                    <span className="text-gray-900">Total Amount</span>
                                    <span className="text-[#0ba6ff]">₹{(Number(selectedOrder.total_amount) + Number(selectedOrder.shipping_fee || 0)).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">Change Order Status</label>
                                    <select
                                        name="status"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black font-semibold text-sm cursor-pointer shadow-sm"
                                        defaultValue={selectedOrder.status.toLowerCase()}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Order Confirmed</option>
                                        <option value="packed">Packed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="out_for_delivery">Out for Delivery</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                        <option value="return_requested">Return Requested</option>
                                        <option value="return_approved">Return Approved</option>
                                        <option value="return_rejected">Return Rejected</option>
                                        <option value="refund_initiated">Refund Initiated</option>
                                        <option value="returned">Returned</option>
                                    </select>
                                </div>
                                <div className="flex flex-col items-start sm:items-end justify-center">
                                    <span className="text-xs font-medium text-gray-500 mb-1">Current Status</span>
                                    <StatusBadge status={selectedOrder.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} />
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                {selectedOrder.shiprocket_order_id ? (
                                    <div className="flex flex-wrap gap-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                        <span className="w-full text-xs font-extrabold text-indigo-800 uppercase tracking-widest mb-2">
                                            Shiprocket Panel (AWB: {selectedOrder.tracking_number || 'Pending'})
                                        </span>

                                        {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'returned' && (
                                            <>
                                                <button type="button" onClick={async () => { await requestPickup(selectedOrder.shiprocket_shipment_id); }} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer">Schedule Pickup</button>
                                                <button type="button" onClick={async () => { const res = await generateLabel(selectedOrder.shiprocket_shipment_id); if (res.success && res.data.label_created) window.open(res.data.label_url, '_blank'); }} className="px-4 py-2 text-xs font-bold text-indigo-700 bg-white rounded-lg shadow-sm border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer">Download Label</button>
                                            </>
                                        )}

                                        <button type="button" onClick={async () => { const res = await generateInvoice(selectedOrder.shiprocket_order_id); if (res.success && res.data.is_invoice_created) window.open(res.data.invoice_url, '_blank'); }} className="px-4 py-2 text-xs font-bold text-indigo-700 bg-white rounded-lg shadow-sm border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer">Download Invoice</button>

                                        {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'returned' && (
                                            <button type="button" onClick={async () => { await cancelShipment(selectedOrder.id, selectedOrder.tracking_number); }} className="px-4 py-2 text-xs font-bold text-red-700 bg-red-50 rounded-lg shadow-sm border border-red-200 hover:bg-red-100 transition-colors cursor-pointer">Cancel Shipment</button>
                                        )}

                                        {selectedOrder.status === 'delivered' && (
                                            <button type="button" onClick={async () => { await initiateReturn(selectedOrder.id); }} className="px-4 py-2 text-xs font-bold text-orange-700 bg-orange-50 rounded-lg shadow-sm border border-orange-200 hover:bg-orange-100 transition-colors cursor-pointer">Initiate Return</button>
                                        )}
                                    </div>
                                ) : (
                                    <button type="button" onClick={handleShiprocketSync} disabled={isPushing || selectedOrder.status === 'cancelled' || selectedOrder.status === 'returned'} className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-[#0ba6ff] rounded-lg shadow-md hover:bg-[#0092e6] transition-colors disabled:opacity-50 cursor-pointer">
                                        {isPushing ? 'Pushing...' : 'Push Order to Shiprocket'}
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isPending}
                                className="px-6 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                Close Details
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="px-6 py-2.5 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-lg disabled:opacity-70 cursor-pointer"
                            >
                                {isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {enlargedImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-pointer"
                    onClick={() => setEnlargedImage(null)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setEnlargedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full cursor-pointer transition-colors"
                        >
                            <X size={28} strokeWidth={2.5} />
                        </button>
                        <img
                            src={enlargedImage}
                            alt="Enlarged Product"
                            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}