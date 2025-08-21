"use client";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import { store } from "../store/store";
import { Provider } from "react-redux";
import { ApolloProvider } from '@apollo/client';
import client from "@frontend/apollo-client";
import { SharedMetaData, LoadingSpinner, PerformanceOptimizer, LoadingProvider } from "@frontend/shared-ui";
import { useAuthInit, RouteGuard } from "@frontend/shared-utils";
import { initializeAuth } from "../store/authSlice";

// Dynamic imports for better code splitting
import dynamic from 'next/dynamic';

const ThemeRegistry = dynamic(() => import("../components/ThemeRegistry"), {
  ssr: false
});

const ToastContainer = dynamic(
  () => import("react-toastify").then(mod => ({ default: mod.ToastContainer })),
  { ssr: false }
);

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  useAuthInit({ portal: 'user', initializeAuth });
  return <>{children}</>;
};

const GlobalRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();


  const isAuthRoute = pathname.startsWith('/auth');
  const isPublicRoute = pathname === '/' || pathname === '/home' || pathname === '/about' || pathname === '/contact';

  if (isAuthRoute || isPublicRoute) {
    return (
      <RouteGuard portal="user" requireAuth={false}>
        {children}
      </RouteGuard>
    );
  }

  return (
    <RouteGuard portal="user" requireAuth={true}>
      {children}
    </RouteGuard>
  );
};

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isPublicRoute = pathname === '/' || pathname === '/home' || pathname === '/about' || pathname === '/contact';
  
  return (
    <Provider store={store}>
      <AuthInitializer>
        {isPublicRoute ? (
          <GlobalRouteGuard>{children}</GlobalRouteGuard>
        ) : (
          <LoadingProvider>
            <GlobalRouteGuard>{children}</GlobalRouteGuard>
          </LoadingProvider>
        )}
      </AuthInitializer>
    </Provider>
  );
};

const getPreloadRoutes = (pathname: string) => {
  if (pathname.startsWith('/auth') || pathname === '/' || pathname === '/home' || pathname === '/about' || pathname === '/contact') return [];
  return ['/dashboard', '/assessment', '/settings', '/users', '/help'];
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${geistMono.variable}`}>
        <SharedMetaData title="User Portal" />
        <PerformanceOptimizer preloadRoutes={getPreloadRoutes(pathname)} />
        <ThemeRegistry>
          <ReduxProvider>
            <ApolloProvider client={client}>
              <Box sx={{ display: 'flex' }}>
                <Box component="main" sx={{ flexGrow: 1, p: 0, backgroundColor: '#f9fbfc', minHeight: '100vh' }}>
                  {children}
                </Box>
              </Box>
            </ApolloProvider>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              style={{ zIndex: 9999 }}
            />
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}