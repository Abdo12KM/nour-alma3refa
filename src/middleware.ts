import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define paths that require authentication and paths that are for non-authenticated users
const authenticatedPaths = [
  "/lessons", 
  "/progress", 
  "/learn",
  "/api/users",
  "/api/text-to-speech",
  "/api/speech-to-text",
  "/api/detect-letter"
];

// Public endpoints that don't require authentication
const publicPaths = ["/login", "/register", "/api/auth"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authCookie = request.cookies.get("auth-storage");

  // Check authentication status
  let isAuthenticated = false;

  if (authCookie?.value) {
    try {
      const authData = JSON.parse(decodeURIComponent(authCookie.value));
      isAuthenticated = Boolean(authData.state?.isAuthenticated);
    } catch (error) {
      isAuthenticated = false;
    }
  }

  // Determine if the current path is a public path (login/register/auth)
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Determine if the current path requires authentication
  const requiresAuth = authenticatedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // 1. User is authenticated but trying to access login/register pages
  if (isAuthenticated && isPublicPath && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. User is NOT authenticated and trying to access protected routes
  if (!isAuthenticated && requiresAuth) {
    // For API routes, return a JSON error instead of redirecting
    if (pathname.startsWith("/api/")) {
      return new NextResponse(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // For UI routes, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // In all other cases, proceed with the request
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/login",
    "/register",
    "/lessons/:path*",
    "/progress/:path*",
    "/learn",
    "/api/users/:path*",
    "/api/text-to-speech",
    "/api/speech-to-text",
    "/api/detect-letter",
    "/api/profile-audio",
  ],
};
