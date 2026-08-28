'use client';

import { useState, useEffect } from 'react';
import { Star, Edit2, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import StatusBadge from '@/components/dashboard/shared/StatusBadge';
import Modal from '@/components/dashboard/shared/Modal';
import { createClient } from '@/lib/supabase/client';

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment, created_at, is_approved,
          products ( id, title, product_images (image_url) )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setReviews(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (review) => {
    setSelectedReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setIsModalOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!selectedReview) return;
    setIsUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .update({ rating: editRating, comment: editComment, is_approved: false })
        .eq('id', selectedReview.id);
      if (!error) {
        setIsModalOpen(false);
        fetchReviews();
      }
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) fetchReviews();
    } catch (error) {}
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={14} className={star <= rating ? 'fill-[#cfa874] text-[#cfa874]' : 'fill-gray-100 text-gray-200'} />
      ))}
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-10 h-10 animate-spin text-[#0ba6ff]" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-[100px] lg:pt-[120px] space-y-6 font-sans pb-10">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-[14px] sm:text-[16px] text-gray-500 mt-1">Manage the feedback you've left on your purchased items.</p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {reviews.map((review) => {
          const product = review.products;
          let imageUrl = '/images/placeholder.jpg';
          const images = product?.product_images;
          if (Array.isArray(images) && images.length > 0) {
            imageUrl = typeof images[0] === 'string' ? images[0] : (images[0]?.image_url || '/images/placeholder.jpg');
          }
          const date = new Date(review.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
          const reviewStatus = review.is_approved === true ? 'Published' : 'Pending';

          return (
            <Card key={review.id} className="p-4 sm:p-6 shadow-sm border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="flex items-start gap-4 sm:w-1/3 w-full border-b sm:border-b-0 border-gray-100 pb-4 sm:pb-0">
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-lg bg-gray-100 overflow-hidden relative shrink-0 border border-gray-200">
                  <img src={imageUrl} alt={product?.title} className="object-cover w-full h-full" onError={(e) => e.currentTarget.src = '/images/placeholder.jpg'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[13px] sm:text-sm text-gray-900 line-clamp-2 leading-tight">{product?.title}</h3>
                  <div className="mt-2.5">
                    <StatusBadge status={reviewStatus === 'Published' ? 'Completed' : 'Pending'} />
                  </div>
                </div>
              </div>

              <div className="sm:w-2/3 flex flex-col w-full">
                <div className="flex justify-between items-center mb-3">
                  {renderStars(review.rating)}
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium">{date}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] sm:text-[14px] text-gray-700 leading-relaxed bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100 relative">
                    <MessageSquare size={14} className="absolute top-3 sm:top-4 left-3 sm:left-4 text-gray-300" />
                    <span className="ml-6 block">{review.comment}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-3 sm:pt-4 border-t border-gray-100 justify-end">
                  <button onClick={() => handleEditClick(review)} className="text-[13px] sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDeleteReview(review.id)} className="text-[13px] sm:text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </Card>
          );
        })}

        {reviews.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Star size={40} className="mx-auto text-gray-200 mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
            <p className="text-gray-500 text-[13px] sm:text-sm mt-1">When you review products, they will appear here.</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Your Review"
      >
        {selectedReview && (
          <form className="space-y-5">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-12 h-14 rounded-md overflow-hidden relative shrink-0 border border-gray-200">
                <img
                  src={(() => {
                    const images = selectedReview.products?.product_images;
                    if (Array.isArray(images) && images.length > 0) {
                      return typeof images[0] === 'string' ? images[0] : (images[0]?.image_url || '/images/placeholder.jpg');
                    }
                    return '/images/placeholder.jpg';
                  })()}
                  alt={selectedReview.products?.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="font-bold text-[13px] text-gray-900 line-clamp-2">{selectedReview.products?.title}</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setEditRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                    <Star size={24} sm:size={28} className={star <= editRating ? 'fill-[#cfa874] text-[#cfa874]' : 'fill-gray-100 text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Your Feedback</label>
              <textarea
                rows="4"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-[13px] sm:text-sm bg-white resize-none"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button disabled={isUpdating} type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-4 py-2.5 text-[13px] sm:text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button disabled={isUpdating} type="button" onClick={handleUpdateReview} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-[13px] sm:text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm">
                {isUpdating && <Loader2 size={14} className="animate-spin" />} Update Review
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}