'use client';

import React, { useState, useEffect } from 'react';
import SrijanLoader from './SrijanLoader';

export default function NavigationLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); 

    return () => clearTimeout(timer);
  }, []);

  
  if (isLoading) {
    return <SrijanLoader />;
  }

  
  return <>{children}</>;
}