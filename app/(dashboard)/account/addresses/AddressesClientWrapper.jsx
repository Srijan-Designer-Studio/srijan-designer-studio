'use client';

import { useState, useTransition } from 'react';
import { Plus, Edit2, Trash2, Home, Briefcase, Loader2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Modal from '@/components/dashboard/shared/Modal';
import { addAddress, deleteAddress, getUserAddresses } from '@/app/actions/addresses';

// Note: To support editing, ensure you add an `updateAddress` function in your actions file.
// For now, the edit mode triggers the same visual flow.
export default function AddressesClientWrapper({ initialAddresses }) {
  const [addresses, setAddresses] = useState(initialAddresses || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      startTransition(async () => {
        await deleteAddress(id);
        const updatedData = await getUserAddresses();
        setAddresses(updatedData);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert checkbox to boolean string for backend processing
    const isDefault = formData.get('isDefault') === 'on' ? 'true' : 'false';
    formData.set('isDefault', isDefault);

    startTransition(async () => {
      try {
        if (modalMode === 'add') {
          await addAddress(formData);
        } else {
          // If you create an updateAddress action, it goes here:
          formData.append('id', selectedAddress.id);
          await updateAddress(formData);
        }

        // Refresh local state with updated database rows
        const updatedData = await getUserAddresses();
        setAddresses(updatedData);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to save address:", error);
        alert(error.message || "Something went wrong.");
      }
    });
  };

  return (
    <div className="max-w-5xl pt-[100px] lg:pt-[120px] space-y-6 font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
          <p className="text-[19px] text-gray-500 mt-1">Add or update your shipping and billing addresses.</p>
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
          <Card key={address.id} className={`relative p-6 shadow-sm border ${address.is_default ? 'border-black' : 'border-gray-200'}`}>

            {/* Default Badge */}
            {address.is_default && (
              <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                DEFAULT
              </span>
            )}

            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-50 rounded-full text-gray-400">
                {address.title?.toLowerCase() === 'home' ? <Home size={20} /> : <Briefcase size={20} />}
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 capitalize">
                  {address.title || 'Address'}
                </h3>

                <div className="mt-3 text-sm text-gray-600 space-y-0.5">
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>{address.country}</p>
                </div>

                <div className="mt-5 flex items-center gap-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEditAddress(address)}
                    disabled={isPending}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isPending}
                    className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
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
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">PIN Code / Postal Code</label>
              <input
                name="postalCode"
                type="text"
                defaultValue={selectedAddress?.postal_code || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                placeholder="e.g. 700001"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
              <input
                name="city"
                type="text"
                defaultValue={selectedAddress?.city || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
                placeholder="e.g. Kolkata"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 1 (House No, Building, Street)</label>
            <input
              name="addressLine1"
              type="text"
              defaultValue={selectedAddress?.address_line_1 || ''}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
              placeholder="e.g. Flat 4B, Harmony Apartments"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Address Line 2 (Locality, Area)</label>
            <input
              name="addressLine2"
              type="text"
              defaultValue={selectedAddress?.address_line_2 || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
              placeholder="e.g. Sector V, Salt Lake"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
              <input
                name="state"
                type="text"
                defaultValue={selectedAddress?.state || ''}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white"
                placeholder="e.g. West Bengal"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Address Type</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="title"
                    value="Home"
                    defaultChecked={!selectedAddress || selectedAddress?.title === 'Home'}
                    className="accent-black"
                  />
                  Home
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="title"
                    value="Office"
                    defaultChecked={selectedAddress?.title === 'Office'}
                    className="accent-black"
                  />
                  Office
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                name="isDefault"
                type="checkbox"
                defaultChecked={selectedAddress?.is_default || false}
                className="rounded border-gray-300 text-black focus:ring-black accent-black"
              />
              Make this my default address
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm disabled:opacity-70"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}