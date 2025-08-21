"use client";
import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageLoader } from "@frontend/shared-ui"

export default function Help() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <PageLoader loading={loading}>
            <DashboardLayout>
                Help
            </DashboardLayout>
        </PageLoader>
    )
}