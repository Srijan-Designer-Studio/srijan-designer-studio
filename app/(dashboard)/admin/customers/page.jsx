import { Suspense } from 'react';
import CustomersClientWrapper from './CustomersClientWrapper';
import { getAllCustomers } from '@/app/actions/admin';

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center p-10 space-y-5">
      <div className="relative w-12 h-12">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
        Loading Customers...
      </p>
    </div>}>
      <CustomersClientWrapper initialCustomers={customers} />
    </Suspense>
  );
}