'use client';

export default function CustomerTracking({ order }) {
  if (!order || !order.liveTracking) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 text-center text-gray-500">
        Tracking details will be available once the order is shipped.
      </div>
    );
  }

  const trackingData = order.liveTracking;
  const activities = trackingData.shipment_track_activities || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Live Tracking (AWB: {order.tracking_number})</h3>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-gray-200">
        {activities.map((activity, index) => (
          <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>

            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-gray-900 text-sm">{activity.activity}</h4>
                <span className="text-xs text-gray-500 font-medium bg-white px-2 py-1 rounded shadow-sm border border-gray-100">
                  {new Date(activity.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[19px] text-gray-600">{activity.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}