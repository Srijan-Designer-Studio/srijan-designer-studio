import { Suspense } from 'react';
import AddressesClientWrapper from './AddressesClientWrapper';
import { getUserAddresses } from '@/app/actions/addresses';

export default async function AddressesPage() {
  // Securely fetch the logged-in user's addresses from PostgreSQL
  const addresses = await getUserAddresses();

  return (
    <Suspense fallback={<div className="flex flex-col items-center justify-center p-10 pt-[120px] space-y-5">
      <div className="relative w-12 h-12">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#00c3ff] border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-500 font-semibold tracking-[0.2em] uppercase text-sm animate-pulse">
        Loading Addresses...
      </p>
    </div>}>
      <AddressesClientWrapper initialAddresses={addresses} />
    </Suspense>
  );
}