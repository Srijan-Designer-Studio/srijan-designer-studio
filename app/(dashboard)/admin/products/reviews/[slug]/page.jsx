import { getProductBySlug, getAdminProductReviews } from "@/app/actions/reviews";
import ProductReviewsClient from "./ProductReviewsClient";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Manage Reviews | Admin",
};

export default async function ProductReviewsPage({ params }) {

  const { slug } = await params;
  
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h2>
        <Link href="/admin/products" className="text-blue-500 hover:underline">
          Go Back to Products
        </Link>
      </div>
    );
  }

 
  const reviews = await getAdminProductReviews(product.id);

  return (
    <div className="max-w-[1200px] mx-auto p-6 text-black">
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center text-gray-500 hover:text-black transition-colors font-medium text-sm">
          <ChevronLeft size={18} className="mr-1" /> Back to Products
        </Link>
      </div>
      <ProductReviewsClient product={product} initialReviews={reviews} />
    </div>
  );
}