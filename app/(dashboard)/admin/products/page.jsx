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
    <ProductsClientWrapper 
      initialProducts={productsData || []} 
      categories={categoriesData || []} 
    />
  );
}