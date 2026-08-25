export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { getAdminProducts } from '@/app/actions/admin';
import ProductsClientWrapper from './ProductsClientWrapper';

export const metadata = {
  title: 'Manage Products | Admin Dashboard',
};

export default async function AdminProductsPage() {
  const productsData = await getAdminProducts();

  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading products...</div>}>
      <ProductsClientWrapper initialProducts={productsData || []} />
    </Suspense>
  );
}