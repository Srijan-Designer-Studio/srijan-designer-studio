'use client';

import { useState } from 'react';
import { Plus, MapPin, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Modal from '@/components/dashboard/shared/Modal';

export default function AddressesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'

  // Mock address data
  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: 'Ananya Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'Flat 4B, Harmony Apartments',
      addressLine2: '123 Fashion Street, Phase 2',
      city: 'Kolkata',
      state: 'West Bengal',
      pin: '700001',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Office',
      name: 'Ananya Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'TechPark Tower A, 5th Floor',
      addressLine2: 'Salt Lake Sector V',
      city: 'Kolkata',
      state: 'West Bengal',
      pin: '700091',
      isDefault: false,
    },
  ];

  const handleAddAddress = () => {
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setModalMode('edit');
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl pt-[100px] lg:pt-[120px space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
          <p className="text-sm text-gray-500 mt-1">Add or update your shipping and billing addresses.</p>
        </div>
        <button 
          onClick={handleAddAddress}
          className="px-4 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {addresses.map((address) => (
          <Card key={address.id} className={`relative p-6 shadow-sm border ${address.isDefault ? 'border-black' : 'border-gray-200'}`}>
            
            {/* Default Badge */}
            {address.isDefault && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                DEFAULT
              </span>
            )}

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                {address.type === 'Home' ? <Home size={20} /> : <Briefcase size={20} />}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  {address.name}
                  <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {address.type}
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                
                <div className="mt-3 text-sm text-gray-600 space-y-0.5">
                  <p>{address.addressLine1}</p>
                  <p>{address.addressLine2}</p>
                  <p>{address.city}, {address.state} {address.pin}</p>
                </div>

                <div className="mt-5 flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleEditAddress(address)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                    <Trash2 size={14} /> Remove
                  </button>
                  {!address.isDefault && (
                    <button className="text-sm font-medium text-gray-500 hover:text-black ml-auto transition-colors">
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Empty State / Add New Card inside Grid */}
        <button 
          onClick={handleAddAddress}
          className="flex flex-col items-center justify-center p-6 h-full min-h-[220px] rounded-xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all text-gray-500 hover:text-black group"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-black group-hover:text-white transition-colors">
            <Plus size={20} />
          </div>
          <span className="font-semibold">Add New Address</span>
        </button>

      </div>

      {/* Reusable Modal for Add/Edit Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? "Add New Address" : "Edit Address"}
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                alert(`Address ${modalMode === 'add' ? 'saved' : 'updated'} successfully!`);
                setIsModalOpen(false);
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm"
            >
              Save Address
            </button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm" placeholder="+91 00000 00000" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">PIN Code</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm" placeholder="6 digits" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm" placeholder="e.g. Kolkata" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1 (House No, Building, Street)</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm" placeholder="e.g. Flat 4B, Harmony Apartments" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2 (Locality, Area)</label>
            <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm" placeholder="e.g. Sector V, Salt Lake" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white">
                <option>West Bengal</option>
                <option>Maharashtra</option>
                <option>Delhi</option>
                <option>Karnataka</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Address Type</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="addressType" value="home" defaultChecked className="accent-black" />
                  Home
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="radio" name="addressType" value="office" className="accent-black" />
                  Office
                </label>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black accent-black" />
              Make this my default address
            </label>
          </div>
        </form>
      </Modal>

    </div>
  );
}