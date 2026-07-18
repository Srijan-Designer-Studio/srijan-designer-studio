'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, MapPin, Clock } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState(null);

  // Fake tracking data generate korar function
  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderId) return;

    setIsSearching(true);

    // Fake API Delay (1.5 seconds) simulating network request
    setTimeout(() => {
      setTrackingData({
        id: orderId,
        date: '15 May, 2026',
        estimatedDelivery: '18 May, 2026',
        status: 'Shipped',
        courier: 'BlueDart Express',
        currentLocation: 'Kolkata Sorting Center',
        steps: [
          { title: 'Order Placed', date: '15 May, 10:30 AM', completed: true },
          { title: 'Processing', date: '15 May, 02:15 PM', completed: true },
          { title: 'Shipped', date: '16 May, 09:00 AM', completed: true, active: true },
          { title: 'Out for Delivery', date: 'Pending', completed: false },
          { title: 'Delivered', date: 'Estimated: 18 May', completed: false },
        ]
      });
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl pt-[100px] lg:pt-[120px mx-auto space-y-6">
      
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your Order ID to get real-time delivery updates.</p>
      </div>

      {/* Search Box Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="e.g. SRJ12345"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center min-w-[140px]"
          >
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Track Order'
            )}
          </button>
        </form>
      </div>

      {/* Tracking Result Section */}
      {trackingData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Order Details Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-6 justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Order Number</p>
              <h3 className="text-lg font-bold text-gray-900">#{trackingData.id.toUpperCase()}</h3>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Estimated Delivery</p>
              <p className="text-gray-900 font-semibold flex items-center gap-2">
                <Clock size={16} className="text-[#0ba6ff]" /> {trackingData.estimatedDelivery}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Courier Partner</p>
              <p className="text-gray-900 font-semibold flex items-center gap-2">
                <Package size={16} className="text-gray-400" /> {trackingData.courier}
              </p>
            </div>
          </div>

          {/* Current Location Alert */}
          <div className="bg-blue-50/50 px-6 py-4 flex items-center gap-3 border-b border-blue-100/50">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Package is in transit</p>
              <p className="text-xs text-blue-700 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> Last scanned at {trackingData.currentLocation}
              </p>
            </div>
          </div>

          {/* Vertical Timeline Stepper */}
          <div className="p-6 sm:p-10">
            <div className="relative">
              {trackingData.steps.map((step, index) => (
                <div key={index} className="flex gap-4 sm:gap-6 mb-8 last:mb-0 relative">
                  
                  {/* Vertical Line between dots */}
                  {index !== trackingData.steps.length - 1 && (
                    <div 
                      className={`absolute left-3.5 sm:left-4 top-10 bottom-[-32px] w-0.5 ${step.completed ? 'bg-black' : 'bg-gray-200'}`}
                    ></div>
                  )}

                  {/* Status Dot / Icon */}
                  <div className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                    step.completed 
                      ? 'bg-black border-black text-white' 
                      : step.active 
                        ? 'bg-white border-black text-black' 
                        : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-black' : 'bg-gray-200'}`}></div>
                    )}
                  </div>

                  {/* Status Details */}
                  <div className="flex-1 pb-2">
                    <h4 className={`text-base font-semibold ${step.completed || step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm mt-1 ${step.completed || step.active ? 'text-gray-500' : 'text-gray-400'}`}>
                      {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}