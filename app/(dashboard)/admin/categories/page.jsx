import { Suspense } from 'react';
import CategoriesClientWrapper from './CategoriesClientWrapper';
import { getCategories } from '@/app/actions/admin';

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading categories...</div>}>
      <CategoriesClientWrapper initialCategories={categories} />
    </Suspense>
  );
}