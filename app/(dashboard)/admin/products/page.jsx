import { Suspense } from 'react';
import { getAdminProducts, getCategories } from '@/app/actions/admin';
import ProductsClientWrapper from './ProductsClientWrapper';

export const metadata = {
  title: 'Manage Products | Admin Dashboard',
};

export default async function AdminProductsPage() {
  const [productsData, categoriesData] = await Promise.all([
    getAdminProducts(),
    getCategories()
  ]);

  return (

    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading products...</div>}>
      <ProductsClientWrapper 
      
        initialProducts={productsData || []} 
        categories={categoriesData || []} 
      />
    </Suspense>
  );
}