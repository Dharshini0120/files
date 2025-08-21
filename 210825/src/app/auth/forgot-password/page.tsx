"use client";
import React, { useState, useEffect } from 'react'
import { SharedForgotPassword, LoadingProvider, PageLoader } from '@frontend/shared-ui'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingProvider>
      <PageLoader loading={loading}>
        <SharedForgotPassword type="user"/>
      </PageLoader>
    </LoadingProvider>
  )
}