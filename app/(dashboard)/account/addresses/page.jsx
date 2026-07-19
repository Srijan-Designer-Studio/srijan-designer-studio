import { Suspense } from 'react';
import AddressesClientWrapper from './AddressesClientWrapper';
import { getUserAddresses } from '@/app/actions/addresses';

export default async function AddressesPage() {
  // Securely fetch the logged-in user's addresses from PostgreSQL
  const addresses = await getUserAddresses();

  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500 pt-[120px]">Loading addresses...</div>}>
      <AddressesClientWrapper initialAddresses={addresses} />
    </Suspense>
  );
}