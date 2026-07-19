import { Suspense } from 'react';
import { getUserOrders } from '@/app/actions/orders';
// import Card from '@/components/dashboard/shared/Card';
// import Table from '@/components/dashboard/shared/Table';
// import StatusBadge from '@/components/dashboard/shared/StatusBadge';
// import Search from '@/components/dashboard/shared/Search';
// import Filter from '@/components/dashboard/shared/Filter';
// import Pagination from '@/components/dashboard/shared/Pagination';
// import Modal from '@/components/dashboard/shared/Modal';

// We must separate the stateful logic into a Client Component
import OrdersClientWrapper from './OrdersClientWrapper'; 

// Server Component (Default Export)
export default async function CustomerOrdersPage() {
  // Fetch data securely on the server
  const orders = await getUserOrders();

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    }>
      <OrdersClientWrapper initialOrders={orders} />
    </Suspense>
  );
}