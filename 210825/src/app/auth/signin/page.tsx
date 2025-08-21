"use client";
import React, { useState, useEffect } from 'react'
import { SharedSignIn, LoadingProvider, PageLoader } from '@frontend/shared-ui'

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingProvider>
      <PageLoader loading={loading}>
        <SharedSignIn type="user" />
      </PageLoader>
    </LoadingProvider>
  )
}
