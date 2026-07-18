'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce'; // Install via: npm install use-debounce

export default function Search({ placeholder }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Wait 300ms after user stops typing

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}