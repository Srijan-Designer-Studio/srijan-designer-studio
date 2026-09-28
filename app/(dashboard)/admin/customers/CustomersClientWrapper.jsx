'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Download, Phone, MapPin, Shield, ChevronLeft, ChevronRight, Mail } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Filter from '@/components/dashboard/shared/Filter';
import Modal from '@/components/dashboard/shared/Modal';

export default function CustomersClientWrapper({ initialCustomers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const formattedCustomers = useMemo(() => {
    return (initialCustomers || []).map((customer) => {
      // Safely handle orders array
      const ordersArr = Array.isArray(customer.orders) ? customer.orders : [];
      const totalSpent = ordersArr.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

      // Email fetch directly from profiles table
      const email = customer.email || customer.auth_users?.email || 'N/A';
      
      // Name Fallback Logic
      let name = `${customer.first_name || ''} ${customer.last_name || ''}`.trim();
      if (!name && email !== 'N/A') {
        name = email.split('@')[0]; // Use email prefix if name is NULL
      } else if (!name) {
        name = 'Unknown Customer';
      }

      return {
        raw: customer,
        id: customer.id,
        name: name,
        email: email,
        phone: customer.phone || 'N/A',
        orders: ordersArr.length,
        spent: `₹${totalSpent.toLocaleString('en-IN')}`,
        status: 'Active',
        joined: customer.created_at ? new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(customer.created_at)) : 'N/A',
        image: customer.avatar_url || '/images/user.png' 
      };
    });
  }, [initialCustomers]);

  const filteredCustomers = useMemo(() => {
    return formattedCustomers.filter((customer) => {
      const query = searchQuery.toLowerCase();
      const name = (customer.name || '').toLowerCase();
      const email = (customer.email || '').toLowerCase();
      const phone = (customer.phone || '').toLowerCase();
      
      const matchesSearch = name.includes(query) || email.includes(query) || phone.includes(query);
      const matchesFilter = filterStatus === 'all' || customer.status.toLowerCase() === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [formattedCustomers, searchQuery, filterStatus]);

  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

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
            <p className="font-semibold text-gray-900 text-sm capitalize">{row.name}</p>
            <p className="text-xs text-gray-500">{row.phone}</p>
          </div>
        </div>
      )
    },
    { header: 'Email', accessor: 'email', render: (row) => <span className="text-gray-600 text-sm">{row.email}</span> },
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
          <p className="text-sm text-gray-500 mt-1">Manage user accounts and view purchase history.</p>
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
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-black text-sm text-black bg-gray-50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto">
            <Filter 
              options={[
                { label: 'All Accounts', value: 'all' },
                { label: 'Active', value: 'active' }, 
                { label: 'Inactive', value: 'inactive' }
              ]} 
              defaultValue="all"
              onChange={(val) => setFilterStatus(val)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto min-w-[800px]">
          <Table columns={customerColumns} data={currentCustomers} />
        </div>

        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-t border-gray-100 bg-white gap-4">
            <div className="text-sm text-gray-600 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md transition-colors cursor-pointer ${
                    currentPage === idx + 1 ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
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
                <h3 className="text-lg font-bold text-gray-900 capitalize">{selectedCustomer.name}</h3>
                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                <div className="mt-2">
                  <StatusBadge status={selectedCustomer.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Phone size={14} /> Phone Number</p>
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Mail size={14} /> Email Address</p>
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><MapPin size={14} /> Member Since</p>
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.joined}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Shield size={14} /> Total Orders</p>
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.orders} Orders</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 sm:col-span-2">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Shield size={14} /> Total Spent</p>
                <p className="text-lg font-bold text-[#cfa874]">{selectedCustomer.spent}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}