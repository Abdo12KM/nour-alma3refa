import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths that require authentication and paths that are for non-authenticated users
const authenticatedPaths = ['/lessons', '/progress'];
const authPaths = ['/login', '/register'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // We can't check the auth state directly in middleware (client-side state),
  // but we can check for auth cookie existence
  const authCookie = request.cookies.get('auth-storage');
  const isLoggedIn = authCookie?.value ? JSON.parse(authCookie.value).state?.isAuthenticated : false;
  const pathname = request.nextUrl.pathname;

  // Check if the path requires authentication
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  const requiresAuth = authenticatedPaths.some(path => pathname.startsWith(path));

  // If user is logged in and trying to access auth paths, redirect to home
  if (isLoggedIn && isAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If path requires auth and user is not logged in, redirect to login
  if (requiresAuth && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/login',
    '/register',
    '/lessons/:path*',
    '/progress/:path*',
  ],
}; 