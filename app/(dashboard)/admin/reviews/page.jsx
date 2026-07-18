'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { Star, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';

function ReviewsContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const reviews = [
    { id: 'REV-01', customer: 'Ananya Sharma', product: 'Premium Hand Embroidered Lehenga', rating: 5, comment: 'Absolutely beautiful! The embroidery is so detailed and the fit was perfect. Highly recommend for weddings.', date: 'May 14, 2024', status: 'Pending', image: '/images/man1.png' },
    { id: 'REV-02', customer: 'Riya Patel', product: 'Designer Anarkali Suit', rating: 4, comment: 'Loved the fabric and the color. Docking one star because delivery took two days longer than expected.', date: 'May 08, 2024', status: 'Published', image: '/images/man1.png' },
    { id: 'REV-03', customer: 'Neha Verma', product: 'Silk Saree Collection', rating: 2, comment: 'The color looks slightly different in person compared to the pictures. A bit disappointed.', date: 'May 01, 2024', status: 'Pending', image: '/images/man1.png' },
    { id: 'REV-04', customer: 'Priya Singh', product: 'Embroidered Kurta Set', rating: 5, comment: 'Very comfortable and stylish. Wore it to a family gathering and got lots of compliments!', date: 'Apr 25, 2024', status: 'Published', image: '/images/man1.png' },
    { id: 'REV-05', customer: 'Spam Bot', product: 'Silk Saree Collection', rating: 1, comment: 'CLICK HERE FOR FREE IPHONES!!! http://spam-link.com', date: 'Apr 20, 2024', status: 'Rejected', image: '/images/man1.png' },
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            size={14} 
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-100 text-gray-200'} 
          />
        ))}
      </div>
    );
  };

  const handleReviewAction = (review, action) => {
    if (action === 'view') {
      setSelectedReview(review);
      setIsModalOpen(true);
    } else {
      alert(`Review marked as ${action}!`);
    }
  };

  const reviewColumns = [
    { 
      header: 'Product', 
      accessor: 'product', 
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
            <Image src={row.image} alt={row.product} fill className="object-cover opacity-80" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-xs line-clamp-1">{row.product}</p>
            <p className="text-[10px] text-gray-500">{row.date}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Customer', 
      accessor: 'customer', 
      render: (row) => <span className="text-sm font-medium text-gray-900">{row.customer}</span> 
    },
    { 
      header: 'Rating', 
      accessor: 'rating', 
      render: (row) => renderStars(row.rating) 
    },
    { 
      header: 'Review', 
      accessor: 'comment', 
      render: (row) => <p className="text-xs text-gray-600 line-clamp-1 max-w-xs">{row.comment}</p> 
    },
    { 
      header: 'Status', 
      accessor: 'status', 
      render: (row) => <StatusBadge status={row.status === 'Pending' ? 'Pending' : row.status === 'Published' ? 'Completed' : 'Cancelled'} /> 
    },
    { 
      header: 'Actions', 
      accessor: 'action', 
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'Pending' && (
            <>
              <button onClick={() => handleReviewAction(row, 'published')} className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                <CheckCircle size={16} />
              </button>
              <button onClick={() => handleReviewAction(row, 'rejected')} className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors" title="Reject">
                <XCircle size={16} />
              </button>
            </>
          )}
          <button 
            onClick={() => handleReviewAction(row, 'view')}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors ml-2"
            title="Read Full Review"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      ) 
    },
  ];

  const statusOptions = [
    { label: 'Pending Moderation', value: 'pending' },
    { label: 'Published', value: 'published' },
    { label: 'Rejected', value: 'rejected' },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-sm text-gray-500 mt-1">Approve, moderate, and reply to customer feedback.</p>
        </div>
      </div>

      <Card className="p-0 shadow-sm border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-xl">
          <div className="w-full sm:w-auto">
            <Filter options={statusOptions} defaultValue="All Reviews" />
          </div>
        </div>

        <Table columns={reviewColumns} data={reviews} />
        <Pagination />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Review Details"
        footer={
          <div className="w-full flex justify-end gap-3">
             {selectedReview?.status === 'Pending' && (
               <>
                 <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                   Reject
                 </button>
                 <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm">
                   Approve & Publish
                 </button>
               </>
             )}
             {selectedReview?.status !== 'Pending' && (
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Close
                </button>
             )}
          </div>
        }
      >
        {selectedReview && (
          <div className="space-y-6">
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-16 h-16 rounded-lg bg-white overflow-hidden relative flex-shrink-0 shadow-sm">
                <Image src={selectedReview.image} alt={selectedReview.product} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Product</p>
                <h3 className="font-bold text-sm text-gray-900">{selectedReview.product}</h3>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-gray-900">{selectedReview.customer}</h4>
                  <p className="text-xs text-gray-500">{selectedReview.date}</p>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              
              <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{selectedReview.comment}"
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Public Reply (Optional)
              </label>
              <textarea 
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-gray-50 focus:bg-white transition-colors resize-none" 
                placeholder="Write a response that will be visible to all customers..." 
              ></textarea>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading reviews...</div>}>
      <ReviewsContent />
    </Suspense>
  );
}