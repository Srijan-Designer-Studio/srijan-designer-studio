'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Role check koro
      if (session.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    }
  }, [session, status, router]);

  return (
    // Tomar landing page er design
    <div>Loading...</div>
  );
}