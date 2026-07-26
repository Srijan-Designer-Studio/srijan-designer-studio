import { Suspense } from 'react';
import ReportsClientWrapper from './ReportsClientWrapper';
import { getAllOrders } from '@/app/actions/admin'; // Reusing your existing action

export default async function AdminReportsPage() {
  // Securely fetch all orders to generate the report
  const orders = await getAllOrders();
  
  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center p-10 space-y-5">
  <div className="relative w-12 h-12">
    {/* Background Ring */}
    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
    {/* Spinning Ring */}
    <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
  </div>
  <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
    Loading Reports...
  </p>
</div>}>
      <ReportsClientWrapper initialOrders={orders} />
    </Suspense>
  );
}