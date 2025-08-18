"use client";
import React, { useState, useEffect } from 'react';
import { SharedSignIn, LoadingProvider, PageLoader } from '@frontend/shared-ui';

const SignInPage = () => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <LoadingProvider>
            <PageLoader loading={loading}>
                <SharedSignIn type="admin" />
            </PageLoader>
        </LoadingProvider>
    );
};

export default SignInPage;