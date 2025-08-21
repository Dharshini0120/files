"use client";
import React, { useState, useEffect } from 'react'
import { SharedOTPVerification, LoadingProvider, PageLoader } from '@frontend/shared-ui'

export default function HospitalDetail() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LoadingProvider>
      <PageLoader loading={loading}>
        <SharedOTPVerification />
      </PageLoader>
    </LoadingProvider>
  )
}