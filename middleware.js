import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";

// Protected routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/admin", "/profile"];

const ADMIN_ROUTES = ["/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Original redirect logic for post-auth-redirect
  const session = await auth0.getSession();

  if (pathname === "/post-auth-redirect" && session === null) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if the current path is a protected route
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    try {
      const cookieStore = await cookies();
      const neoJwtCookie = cookieStore.get("neo-jwt");

      // Redirect to login if the cookie is missing
      if (!neoJwtCookie) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Check role-based authorization for admin routes
      if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
        // Decode the JWT to get the user role
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        const { payload } = await jwtVerify(neoJwtCookie.value, secret);

        // If not admin, redirect to unauthorized page
        if (!payload.user.isAdmin) {
          return NextResponse.redirect(
            new URL("/error?reason=unauthorized", request.url),
          );
        }
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      // In case of error reading cookies or decoding token, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Run Auth0 middleware after our custom checks
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
