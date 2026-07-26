import { Suspense } from 'react';
import ReviewsClientWrapper from './ReviewsClientWrapper';
import { getAllReviews } from '@/app/actions/reviews';

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center p-10 space-y-5">
      <div className="relative w-12 h-12">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
        Loading Reviews...
      </p>
    </div>}>
      <ReviewsClientWrapper initialReviews={reviews} />
    </Suspense>
  );
}