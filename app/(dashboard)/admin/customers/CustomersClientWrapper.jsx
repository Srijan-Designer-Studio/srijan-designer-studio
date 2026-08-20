'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Download, Phone, MapPin, Shield } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

export default function CustomersClientWrapper({ initialCustomers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const formattedCustomers = initialCustomers?.map((customer) => {
    const totalSpent = customer.orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    return {
      raw: customer,
      id: customer.id,
      name: `${customer.first_name} ${customer.last_name}`,
      email: customer.auth_users?.email,
      phone: customer.phone || 'N/A',
      orders: customer.orders?.length || 0,
      spent: `₹${totalSpent.toLocaleString('en-IN')}`,
      status: 'Active',
      joined: new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(customer.created_at)),
      image: '/images/placeholder.jpg'
    };
  }) || [];

  const filteredCustomers = formattedCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const customerColumns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
            <Image src={row.image} alt={row.name} fill sizes="40px" className="object-cover opacity-80" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{row.name}</p>
            <p className="text-[19px] text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Phone', accessor: 'phone', render: (row) => <span className="text-gray-600 text-sm">{row.phone}</span> },
    { header: 'Total Orders', accessor: 'orders', render: (row) => <span className="font-medium text-gray-900">{row.orders}</span> },
    { header: 'Total Spent', accessor: 'spent', render: (row) => <span className="font-bold text-[#cfa874]">{row.spent}</span> },
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
          onClick={() => handleViewCustomer(row)}
          className="text-black hover:text-[#cfa874] font-medium text-sm transition-colors underline underline-offset-2"
        >
          View Details
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-[19px] text-gray-500 mt-1">Manage user accounts and view purchase history.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors">
          <Download size={16} /> Export Data
        </button>
      </div>

      <Card className="p-0 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} defaultValue="All Accounts" />
          </div>
        </div>
        <Table columns={customerColumns} data={filteredCustomers} />
        <Pagination />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Details"
        footer={
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm"
          >
            Close
          </button>
        }
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
                <Image src={selectedCustomer.image} alt={selectedCustomer.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedCustomer.name}</h3>
                <p className="text-[19px] text-gray-500">{selectedCustomer.email}</p>
                <div className="mt-1">
                  <StatusBadge status={selectedCustomer.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[19px] text-gray-500 mb-1 flex items-center gap-1.5"><Phone size={14} /> Phone Number</p>
                <p className="text-[19px] font-medium text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[19px] text-gray-500 mb-1 flex items-center gap-1.5"><MapPin size={14} /> Member Since</p>
                <p className="text-[19px] font-medium text-gray-900">{selectedCustomer.joined}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[19px] text-gray-500 mb-1 flex items-center gap-1.5"><Shield size={14} /> Total Orders</p>
                <p className="text-[19px] font-medium text-gray-900">{selectedCustomer.orders} Orders</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-[19px] text-gray-500 mb-1 flex items-center gap-1.5"><Shield size={14} /> Total Spent</p>
                <p className="text-[19px] font-bold text-[#cfa874]">{selectedCustomer.spent}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}