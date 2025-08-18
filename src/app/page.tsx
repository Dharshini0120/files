"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sessionAuthStorage } from '@frontend/shared-utils';
import SignInPage from './auth/signin/page';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (sessionAuthStorage.isAuthenticated('admin')) {
      router.replace('/dashboard');
    }
  }, [router]);


  return (
    <SignInPage />
  );
}