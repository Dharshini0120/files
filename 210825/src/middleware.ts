import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Session storage is not accessible in middleware
  // Route protection is handled by client-side RouteGuard components
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assessment/:path*', 
    '/users/:path*',
    '/settings/:path*',
    '/auth/:path*'
  ]
};