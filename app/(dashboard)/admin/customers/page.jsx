'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { Download, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Search from '@/components/dashboard/shared/Search';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

function CustomersContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const customers = [
    { id: 'CUST-001', name: 'Ananya Sharma', email: 'ananya@example.com', phone: '+91 98765 43210', orders: 12, spent: '₹1,45,000', status: 'Active', joined: 'Jan 15, 2024', image: '/images/man1.png' },
    { id: 'CUST-002', name: 'Riya Patel', email: 'riya.p@example.com', phone: '+91 87654 32109', orders: 4, spent: '₹34,500', status: 'Active', joined: 'Mar 22, 2024', image: '/images/man1.png' },
    { id: 'CUST-003', name: 'Neha Verma', email: 'neha_v@example.com', phone: '+91 76543 21098', orders: 0, spent: '₹0', status: 'Inactive', joined: 'May 10, 2024', image: '/images/man1.png' },
    { id: 'CUST-004', name: 'Priya Singh', email: 'priya88@example.com', phone: '+91 65432 10987', orders: 25, spent: '₹4,12,000', status: 'Active', joined: 'Nov 05, 2023', image: '/images/man1.png' },
    { id: 'CUST-005', name: 'Kavya Mehta', email: 'kavya.m@example.com', phone: '+91 54321 09876', orders: 1, spent: '₹12,990', status: 'Blocked', joined: 'Apr 18, 2024', image: '/images/man1.png' },
  ];

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(query.toLowerCase()) ||
    customer.email.toLowerCase().includes(query.toLowerCase()) ||
    customer.phone.includes(query)
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
            <p className="text-xs text-gray-500">{row.email}</p>
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
          <p className="text-sm text-gray-500 mt-1">Manage user accounts and view purchase history.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors">
          <Download size={16} /> Export Data
        </button>
      </div>

      <Card className="p-0 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <Search placeholder="Search by name, email, or phone..." />
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
                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                <div className="mt-1">
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
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><MapPin size={14} /> Member Since</p>
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.joined}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Shield size={14} /> Total Orders</p>
                <p className="text-sm font-medium text-gray-900">{selectedCustomer.orders} Orders</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1.5"><Shield size={14} /> Total Spent</p>
                <p className="text-sm font-bold text-[#cfa874]">{selectedCustomer.spent}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading customers...</div>}>
      <CustomersContent />
    </Suspense>
  );
}