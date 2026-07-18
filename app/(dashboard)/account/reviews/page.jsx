'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Edit2, Trash2, MessageSquare } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Modal from '@/components/dashboard/shared/Modal';

export default function CustomerReviewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editRating, setEditRating] = useState(5); // State for interactive stars

  // Mock Data for the logged-in customer's reviews
  const myReviews = [
    { 
      id: 'REV-01', 
      product: 'Premium Hand Embroidered Lehenga', 
      rating: 5, 
      comment: 'Absolutely beautiful! The embroidery is so detailed and the fit was perfect. Highly recommend for weddings.', 
      date: 'May 14, 2024', 
      status: 'Published', 
      image: '/images/man1.png' 
    },
    { 
      id: 'REV-02', 
      product: 'Designer Anarkali Suit', 
      rating: 4, 
      comment: 'Loved the fabric and the color. Docking one star because delivery took two days longer than expected.', 
      date: 'May 08, 2024', 
      status: 'Published', 
      image: '/images/man1.png' 
    },
    { 
      id: 'REV-03', 
      product: 'Silk Saree Collection', 
      rating: 5, 
      comment: 'I just submitted this review, hoping it gets approved soon! The saree is gorgeous.', 
      date: 'May 16, 2024', 
      status: 'Pending', 
      image: '/images/man1.png' 
    }
  ];

  // Helper for static stars display
  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={16} 
          className={star <= rating ? 'fill-[#cfa874] text-[#cfa874]' : 'fill-gray-100 text-gray-200'} 
        />
      ))}
    </div>
  );

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditRating(review.rating);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-4xl space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">Manage the feedback you've left on your purchased items.</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {myReviews.map((review) => (
          <Card key={review.id} className="p-6 shadow-sm border-gray-100 flex flex-col md:flex-row gap-6">
            
            {/* Product Info */}
            <div className="flex items-start gap-4 md:w-1/3">
              <div className="w-20 h-24 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0 border border-gray-200">
                <Image src={review.image} alt={review.product} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{review.product}</h3>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <StatusBadge status={review.status === 'Published' ? 'Completed' : 'Pending'} />
                </p>
              </div>
            </div>

            {/* Review Content */}
            <div className="md:w-2/3 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                {renderStars(review.rating)}
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                  <MessageSquare size={16} className="absolute top-4 left-4 text-gray-300" />
                  <span className="ml-6 block">{review.comment}</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 justify-end">
                <button 
                  onClick={() => handleEditClick(review)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <Edit2 size={14} /> Edit Review
                </button>
                <button className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>

          </Card>
        ))}

        {myReviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Star size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
            <p className="text-gray-500 text-sm mt-1">When you review products, they will appear here.</p>
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Edit Your Review"
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
                alert("Review updated successfully! It will be sent to moderation.");
                setIsModalOpen(false);
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm"
            >
              Update Review
            </button>
          </>
        }
      >
        {selectedReview && (
          <form className="space-y-6">
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-12 h-12 rounded-md overflow-hidden relative border border-gray-200">
                <Image src={selectedReview.image} alt={selectedReview.product} fill className="object-cover" />
              </div>
              <p className="font-bold text-sm text-gray-900 line-clamp-1">{selectedReview.product}</p>
            </div>

            {/* Interactive Star Rating Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={28} 
                      className={star <= editRating ? 'fill-[#cfa874] text-[#cfa874]' : 'fill-gray-100 text-gray-300'} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Your Feedback</label>
              <textarea 
                rows="4"
                defaultValue={selectedReview.comment}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white resize-none" 
              ></textarea>
            </div>

          </form>
        )}
      </Modal>

    </div>
  );
}