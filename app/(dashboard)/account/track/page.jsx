'use client';

import { useState, useTransition } from 'react';
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, Loader2 } from 'lucide-react';
import { trackOrder } from '@/app/actions/orders';
import CustomerTracking from '@/components/track/CustomerTracking'; 

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [isPending, startTransition] = useTransition();
  const [trackingData, setTrackingData] = useState(null);
  const [rawOrderData, setRawOrderData] = useState(null); 
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderId) return;
    setErrorMsg('');
    setTrackingData(null);
    setRawOrderData(null);

    startTransition(async () => {
      try {
        const data = await trackOrder(orderId);
        setRawOrderData(data); 
        
        const createdDate = new Date(data.created_at);
        const estimatedDate = new Date(createdDate);
        estimatedDate.setDate(estimatedDate.getDate() + 5);

        const timeline = ['pending', 'processing', 'shipped', 'delivered'];
        const currentIndex = timeline.indexOf(data.status);

        const steps = [
          { title: 'Order Placed', date: new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(createdDate), completed: true, active: false },
          { title: 'Processing', date: currentIndex >= 1 ? 'Completed' : 'Pending', completed: currentIndex > 1, active: currentIndex === 1 },
          { title: 'Shipped', date: currentIndex >= 2 ? 'Completed' : 'Pending', completed: currentIndex > 2, active: currentIndex === 2 },
          { title: 'Delivered', date: currentIndex === 3 ? 'Completed' : `Estimated: ${new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric' }).format(estimatedDate)}`, completed: currentIndex === 3, active: false },
        ];

        setTrackingData({
          id: data.id.split('-')[0].toUpperCase(),
          estimatedDelivery: new Intl.DateTimeFormat('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }).format(estimatedDate),
          status: data.status.charAt(0).toUpperCase() + data.status.slice(1),
          courier: data.tracking_number ? 'Shiprocket Partner' : 'Pending Assignment',
          currentLocation: data.tracking_number ? 'In Transit' : 'Warehouse',
          steps
        });
      } catch (error) {
        setErrorMsg(error.message);
      }
    });
  };

  return (
    <div className="max-w-3xl pt-[100px] text-black lg:pt-[120px] mx-auto space-y-6 px-4 sm:px-0">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your Order ID to get real-time delivery updates.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="e.g. SRJ12345 or full UUID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center min-w-[140px]"
          >
            {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Track Order'}
          </button>
        </form>
        {errorMsg && <p className="text-red-500 text-sm mt-3 font-medium">{errorMsg}</p>}
      </div>

      {trackingData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-6 justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Order Number</p>
              <h3 className="text-lg font-bold text-gray-900">#{trackingData.id}</h3>
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

          <div className="bg-blue-50/50 px-6 py-4 flex items-center gap-3 border-b border-blue-100/50">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
              <Truck size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900">Order is {trackingData.status}</p>
              <p className="text-xs text-blue-700 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {trackingData.currentLocation}
              </p>
            </div>
          </div>

         
          {rawOrderData && rawOrderData.liveTracking ? (
             <div className="p-6 sm:p-10 border-t border-gray-100">
                <CustomerTracking order={rawOrderData} />
             </div>
          ) : (
            <div className="p-6 sm:p-10">
              <div className="relative">
                {trackingData.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 sm:gap-6 mb-8 last:mb-0 relative">
                    
                    {index !== trackingData.steps.length - 1 && (
                      <div 
                        className={`absolute left-3.5 sm:left-4 top-10 bottom-[-32px] w-0.5 ${step.completed ? 'bg-black' : 'bg-gray-200'}`}
                      ></div>
                    )}

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
          )}

        </div>
      )}
    </div>
  );
}