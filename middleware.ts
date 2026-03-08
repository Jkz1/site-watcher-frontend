import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthCookie } from './app/actions/auth';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value

    // Define your paths
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

    if (isProtectedRoute && !token) {
        // Redirect to login if trying to access dashboard without a token
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// The matcher controls which routes this middleware runs on
export const config = {
    matcher: ['/dashboard/:path*'],
};