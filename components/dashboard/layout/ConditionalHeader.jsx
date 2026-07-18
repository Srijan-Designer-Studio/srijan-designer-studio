'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Jodi admin panel e thake, tahole Navbar dekhabe na (hide)
  if (pathname.startsWith('/admin')) {
    return null; 
  }

  // Customer panel (/account) e thakle main Navbar dekhabe
  return <Header />;
}