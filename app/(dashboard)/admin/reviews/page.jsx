// page_3.jsx
import { Suspense } from 'react';
import ReviewsClientWrapper from './ReviewsClientWrapper';
import { getAllReviews } from '@/app/actions/reviews';

export const metadata = {
  title: "All Reviews | Admin",
};

export default async function AdminReviewsPage() {
  const reviews = await getAllReviews();

  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-10 space-y-5 min-h-[50vh]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
          Loading Reviews...
        </p>
      </div>
    }>
      <ReviewsClientWrapper initialReviews={reviews} />
    </Suspense>
  );
}