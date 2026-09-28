'use client';

import { useState } from 'react';
import { Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomRequestsClient({ requests }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;
  const totalItems = requests.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  const getSourceBadge = (source) => {
    const raw = (source || '').toLowerCase().trim();
    if (raw.includes('wedding')) return { label: 'Wedding Wear', className: 'bg-pink-100 text-pink-700' };
    if (raw.includes('kid')) return { label: 'Kids Wear', className: 'bg-blue-100 text-blue-700' };
    if (raw.includes('fit') || raw.includes('custom')) return { label: 'Customize', className: 'bg-amber-100 text-amber-700' };
    return { label: source || 'Unknown', className: 'bg-gray-100 text-gray-700' };
  };

  const openModal = (req) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

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
                  <th className="px-6 py-4 font-semibold text-center">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                {currentRequests.length > 0 ? (
                  currentRequests.map((req) => {
                    const badge = getSourceBadge(req.source_page);
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
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openModal(req)}
                            className="p-2 text-gray-500 hover:text-[#00c3ff] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="View Message"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    );
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

          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-5 border-t border-gray-100 bg-white gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                      currentPage === idx + 1 ? 'bg-[#00c3ff] text-white border-[#00c3ff]' : 'text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Message Details</h2>
              <button 
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">From</p>
                <p className="font-semibold text-gray-800">{selectedRequest.name}</p>
                <p className="text-sm text-gray-500">{selectedRequest.email}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Message</p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedRequest.details || <span className="italic text-gray-400">No message provided.</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}