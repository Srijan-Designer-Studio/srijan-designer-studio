'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, Phone, MapPin, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Filter from '@/components/dashboard/shared/Filter';
import Modal from '@/components/dashboard/shared/Modal';

export default function CustomersClientWrapper({ initialCustomers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formattedCustomers = initialCustomers?.map((customer) => {
    const totalSpent = customer.orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    return {
      raw: customer,
      id: customer.id,
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown',
      email: customer.auth_users?.email || 'N/A',
      phone: customer.phone || 'N/A',
      orders: customer.orders?.length || 0,
      spent: `₹${totalSpent.toLocaleString('en-IN')}`,
      status: 'Active',
      joined: new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(customer.created_at)),
      image: customer.avatar_url || '/images/user.png' 
    };
  }) || [];

  const filteredCustomers = formattedCustomers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    const name = (customer.name || '').toLowerCase();
    const email = (customer.email || '').toLowerCase();
    const phone = (customer.phone || '').toLowerCase();
    
    return name.includes(query) || email.includes(query) || phone.includes(query);
  });

  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

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
          className="text-black hover:text-[#cfa874] font-medium text-sm transition-colors underline underline-offset-2 cursor-pointer"
        >
          View Details
        </button>
      )
    },
  ];

  return (
    <div className="space-y-6 font-sans relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-[19px] text-gray-500 mt-1">Manage user accounts and view purchase history.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors cursor-pointer">
          <Download size={16} /> Export Data
        </button>
      </div>

      <Card className="p-0 shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <div className="relative w-full sm:w-[400px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm text-black bg-gray-50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter options={[{ label: 'Active', value: 'active' }, { label: 'Inactive', value: 'inactive' }]} defaultValue="All Accounts" />
          </div>
        </div>
        
        <div className="overflow-x-auto min-w-[800px]">
          <Table columns={customerColumns} data={currentCustomers} />
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
                  className={`px-4 py-2 text-sm font-bold border focus:outline-none transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-black text-white border-black z-10 relative shadow-sm'
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
        title="Customer Details"
        footer={
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm cursor-pointer"
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