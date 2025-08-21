"use client";
import React, { useState, useEffect } from 'react'
import { SharedSignUp, LoadingProvider, PageLoader } from '@frontend/shared-ui'

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingProvider>
      <PageLoader loading={loading}>
        <SharedSignUp />
      </PageLoader>
    </LoadingProvider>
  )
}