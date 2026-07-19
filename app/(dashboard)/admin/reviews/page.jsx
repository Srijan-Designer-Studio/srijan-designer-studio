import { Suspense } from 'react';
import ReviewsClientWrapper from './ReviewsClientWrapper';
import { getAllReviews } from '@/app/actions/reviews';

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();
  
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading reviews...</div>}>
      <ReviewsClientWrapper initialReviews={reviews} />
    </Suspense>
  );
}