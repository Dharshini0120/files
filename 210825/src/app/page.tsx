"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionAuthStorage } from '@frontend/shared-utils';
import HomePage from "./home/page";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (sessionAuthStorage.isAuthenticated('user')) {
      router.replace('/dashboard');
    }
  }, [router]);



  return <HomePage />;
};

export default Home;