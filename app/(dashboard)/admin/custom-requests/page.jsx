import { createAdminClient } from '@/lib/supabase/admin'

// CustomRequestsPage
export default async function CustomRequestsPage() {
  const supabase = createAdminClient()

  const { data: requests, error } = await supabase
    .from('custom_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-8 text-red-500 font-bold">Error fetching data: {error.message}</div>
  }

  const getSourceBadge = (source) => {
    const raw = (source || '').toLowerCase().trim()

    if (raw.includes('wedding')) {
      return {
        label: 'Wedding Wear',
        className: 'bg-pink-100 text-pink-700'
      }
    }
    if (raw.includes('kid')) {
      return {
        label: 'Kids Wear',
        className: 'bg-blue-100 text-blue-700'
      }
    }
    if (raw.includes('fit') || raw.includes('custom')) {
      return {
        label: 'Customize',
        className: 'bg-amber-100 text-amber-700'
      }
    }

    return {
      label: source || 'Unknown',
      className: 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Custom Wear Requests</h1>
        <p className="text-gray-500 mb-8">Manage all your custom styling and wedding inquiries here.</p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Source</th>
                  <th className="px-6 py-4 font-semibold">Client Details</th>
                  <th className="px-6 py-4 font-semibold">Outfit & Budget</th>
                  <th className="px-6 py-4 font-semibold">Call Back Info</th>
                  <th className="px-6 py-4 font-semibold">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                {requests && requests.length > 0 ? (
                  requests.map((req) => {
                    const badge = getSourceBadge(req.source_page)

                    return (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(req.created_at).toLocaleDateString('en-GB')}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{req.name}</p>
                          <p className="text-gray-500">{req.email}</p>
                          <p className="text-gray-500">{req.phone}</p>
                        </td>

                        <td className="px-6 py-4">
                          <p className="font-medium">{req.outfit_type || 'N/A'}</p>
                          <p className="text-green-600 font-semibold">{req.budget || 'N/A'}</p>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-800">{req.callback_date}</p>
                          <p className="text-blue-500 font-medium">{req.callback_time}</p>
                        </td>

                        <td className="px-6 py-4 max-w-xs truncate" title={req.details}>
                          {req.details || <span className="text-gray-400 italic">No message</span>}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 font-medium">
                      No requests found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}  