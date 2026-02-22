import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and auth pages
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Check if the user is accessing a protected route
  if (pathname.startsWith("/dashboard")) {
    // In demo mode, we don't enforce authentication via middleware
    // The session provider will handle redirects
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
      // Get session from cookie to check role-based access
      const sessionCookie = request.cookies.get("chorequest-session")

      if (sessionCookie) {
        try {
          const session = JSON.parse(sessionCookie.value)

          // Enforce role-based access control
          if (pathname.startsWith("/dashboard/parent") && session.role !== "parent") {
            return NextResponse.redirect(new URL("/dashboard/child", request.url))
          }

          if (pathname.startsWith("/dashboard/child") && session.role !== "child") {
            return NextResponse.redirect(new URL("/dashboard/parent", request.url))
          }
        } catch (error) {
          // Invalid session cookie, redirect to sign in
          return NextResponse.redirect(new URL("/auth/signin", request.url))
        }
      }

      return NextResponse.next()
    }

    // Check if the user has a session cookie (for production)
    const hasDemoModeCookie = request.cookies.has("demo-mode")

    // If no session cookie, redirect to sign in
    if (!hasDemoModeCookie) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (authentication routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
}
