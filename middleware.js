import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  "/inbox",
  "/quests",
  "/history",
  "/profile",
  "/settings",
  "/submissions",
  "/leaderboard",
  "/notifications",
  "/admin",
];

const ADMIN_ROUTES = ["/admin"];

const PUBLIC_AUTH_ROUTES = ["/login", "/sign-up", "/login/admin"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Verify JWT token once
  const jwtPayload = await verifyJwtToken();
  const isAuthenticated = !!jwtPayload;

  const isAdmin = isAuthenticated && jwtPayload.user.isAdmin;

  // Handle root path - redirect based on authentication status and role
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/quests", request.url),
    );
  }

  // Prevent access to login/sign-up for logged-in users
  if (PUBLIC_AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/quests", request.url),
    );
  }

  // Check if the current path is a protected route
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check role-based authorization for admin routes
    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route)) && !isAdmin) {
      return NextResponse.redirect(
        new URL("/error?reason=unauthorized", request.url),
      );
    }
  }

  // Original redirect logic for post-auth-redirect
  const session = await auth0.getSession();

  if (pathname === "/post-auth-redirect" && session === null) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Run Auth0 middleware after our custom checks
  return await auth0.middleware(request);
}

// Helper function to verify JWT token
async function verifyJwtToken() {
  try {
    const cookieStore = await cookies();
    const neoJwtCookie = cookieStore.get("neo-jwt");

    if (!neoJwtCookie) {
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(neoJwtCookie.value, secret);

    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
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
