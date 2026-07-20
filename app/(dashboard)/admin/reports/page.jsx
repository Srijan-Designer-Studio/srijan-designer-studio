import { Suspense } from 'react';
import ReportsClientWrapper from './ReportsClientWrapper';
import { getAllOrders } from '@/app/actions/admin'; // Reusing your existing action

export default async function AdminReportsPage() {
  // Securely fetch all orders to generate the report
  const orders = await getAllOrders();
  
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading reports...</div>}>
      <ReportsClientWrapper initialOrders={orders} />
    </Suspense>
  );
}