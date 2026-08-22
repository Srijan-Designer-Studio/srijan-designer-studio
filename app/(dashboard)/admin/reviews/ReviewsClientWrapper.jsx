'use client';

import { useState, useTransition, useMemo } from 'react';
import { Star, CheckCircle, XCircle, Loader2, Trash2, Eye } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import Table from '@/components/dashboard/shared/Table';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Filter from '@/components/dashboard/shared/Filter';
import Pagination from '@/components/dashboard/shared/Pagination';
import Modal from '@/components/dashboard/shared/Modal';
import { updateReviewStatus, getAllReviews } from '@/app/actions/reviews';

export default function ReviewsClientWrapper({ initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isPending, startTransition] = useTransition();

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
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
      return;
    }

    const reviewId = review?.raw?.id || review?.id;
    if (!reviewId) return;

    if (action === 'deleted' && !window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    startTransition(async () => {
      try {
        let newStatus;
        if (action === 'published') newStatus = true;
        if (action === 'rejected') newStatus = false;
        if (action === 'deleted') newStatus = 'deleted';

        const res = await updateReviewStatus(reviewId, newStatus);
        if (res?.success) {
          const updated = await getAllReviews();
          setReviews(updated || []);
          setIsModalOpen(false);
        } else {
          alert(res?.message || 'Failed to update review status.');
        }
      } catch (error) {
        console.error(error);
        alert('An unexpected error occurred.');
      }
    });
  };

  const formattedReviews = useMemo(() => {
    return (reviews || []).map(r => {
      let imageUrl = '/images/placeholder.jpg';
      const images = r.products?.product_images;
      if (Array.isArray(images) && images.length > 0) {
        imageUrl = typeof images[0] === 'string' ? images[0] : (images[0]?.image_url || '/images/placeholder.jpg');
      }

      return {
        raw: r,
        id: r.id,
        customer: `${r.profiles?.first_name || 'Guest'} ${r.profiles?.last_name || ''}`.trim(),
        product: r.products?.title || 'Unknown Product',
        rating: r.rating || 5,
        comment: r.comment || '',
        date: new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(r.created_at || Date.now())),
        status: r.is_approved === true ? 'Published' : r.is_approved === false ? 'Pending' : 'Rejected',
        image: imageUrl
      };
    });
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filterStatus === 'pending') {
      return formattedReviews.filter(r => r.status === 'Pending');
    }
    if (filterStatus === 'published') {
      return formattedReviews.filter(r => r.status === 'Published');
    }
    return formattedReviews;
  }, [formattedReviews, filterStatus]);

  const reviewColumns = [
    {
      header: 'Product',
      accessor: 'product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
            <img
              src={row.image}
              alt={row.product}
              className="object-cover w-full h-full"
              onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-xs line-clamp-1 max-w-[200px]">{row.product}</p>
            <p className="text-[11px] text-gray-400">{row.date}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => <span className="text-xs font-medium text-gray-900">{row.customer}</span>
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
      render: (row) => (
        <StatusBadge status={row.status === 'Published' ? 'Completed' : 'Pending'} />
      )
    },
    {
      header: 'Actions',
      accessor: 'action',
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Pending' ? (
            <>
              <button
                disabled={isPending}
                onClick={() => handleReviewAction(row, 'published')}
                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                title="Approve & Publish"
              >
                <CheckCircle size={16} />
              </button>
              <button
                disabled={isPending}
                onClick={() => handleReviewAction(row, 'deleted')}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                title="Delete"
              >
                <XCircle size={16} />
              </button>
            </>
          ) : (
            <button
              disabled={isPending}
              onClick={() => handleReviewAction(row, 'deleted')}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}

          <button
            onClick={() => handleReviewAction(row, 'view')}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
            title="View Details"
          >
            <Eye size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
          <p className="text-sm text-gray-500 mt-1">Approve, moderate, and manage customer feedback.</p>
        </div>
      </div>

      <Card className="p-0 shadow-sm border-gray-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 border-b border-gray-100 bg-white">
          <div className="w-full sm:w-auto">
            <Filter
              options={[
                { label: 'All Reviews', value: 'all' },
                { label: 'Pending Moderation', value: 'pending' },
                { label: 'Published', value: 'published' }
              ]}
              defaultValue="all"
              onChange={(val) => setFilterStatus(val)}
            />
          </div>
        </div>

        <Table columns={reviewColumns} data={filteredReviews} />
        <Pagination />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Review Details"
        footer={
          <div className="w-full flex justify-end gap-3">
            {selectedReview?.status === 'Pending' ? (
              <>
                <button
                  disabled={isPending}
                  onClick={() => handleReviewAction(selectedReview, 'deleted')}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject & Delete
                </button>
                <button
                  disabled={isPending}
                  onClick={() => handleReviewAction(selectedReview, 'published')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approve & Publish
                </button>
              </>
            ) : (
              <>
                <button
                  disabled={isPending}
                  onClick={() => handleReviewAction(selectedReview, 'deleted')}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  Close
                </button>
              </>
            )}
          </div>
        }
      >
        {selectedReview && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-14 h-14 rounded-lg bg-white overflow-hidden relative flex-shrink-0 shadow-sm border border-gray-200">
                <img
                  src={selectedReview.image}
                  alt={selectedReview.product}
                  className="object-cover w-full h-full"
                  onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg'; }}
                />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5 font-bold">Product</p>
                <h3 className="font-bold text-sm text-gray-900 leading-tight">{selectedReview.product}</h3>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{selectedReview.customer}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{selectedReview.date}</p>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              <div className="bg-gray-50/70 p-4 border border-gray-100 rounded-xl">
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{selectedReview.comment}"
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}