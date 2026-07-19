import { Suspense } from 'react';
import CustomersClientWrapper from './CustomersClientWrapper';
import { getAllCustomers } from '@/app/actions/admin';

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();
  
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500">Loading customers...</div>}>
      <CustomersClientWrapper initialCustomers={customers} />
    </Suspense>
  );
}