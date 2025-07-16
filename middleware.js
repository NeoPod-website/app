import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

import { auth0 } from "./lib/auth0";

// Define protected and public routes
const PROTECTED_ROUTES = [
  "/inbox",
  "/quests",
  "/history",
  "/profile",
  "/settings",
  "/submissions",
  "/leaderboard",
  "/notifications",
  "/view",
  "/admin",
];

const ADMIN_ROUTES = ["/admin", "/view"];

const PUBLIC_AUTH_ROUTES = ["/login", "/sign-up", "/login/admin", "/invite"];

// Main middleware handler
export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // ✅ Use the passed request for cookie access
  const jwtPayload = await verifyJwtToken(request);

  const isAuthenticated = !!jwtPayload;
  const isAdmin = isAuthenticated && jwtPayload.user?.isAdmin;

  // Redirect root path if authenticated
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/quests", request.url),
    );
  }

  // Prevent access to login pages if already logged in
  if (PUBLIC_AUTH_ROUTES.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/quests", request.url),
    );
  }

  // Check for protected routes
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (ADMIN_ROUTES.some((route) => pathname.startsWith(route)) && !isAdmin) {
      return NextResponse.redirect(
        new URL("/error?reason=unauthorized", request.url),
      );
    }
  }

  // Optional: check session on post-auth route
  if (pathname === "/post-auth-redirect") {
    const session = await auth0.getSession(request);
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Let Auth0 handle session logic and return response
  return auth0.middleware(request);
}

// ✅ JWT Token Verification with Request Scope
async function verifyJwtToken(request) {
  try {
    const jwtCookie = request.cookies.get("neo-jwt");

    if (!jwtCookie?.value) return null;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(jwtCookie.value, secret);

    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
