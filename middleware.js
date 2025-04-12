import { NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import { getAuthCookies } from "@/utils/auth-cookies";

export async function middleware(request) {
  // const path = request.nextUrl.pathname;

  // // Define public paths that don't require authentication
  // const publicPaths = ["/login", "/sign-up"];

  // // Check if API route (these handle their own auth)
  // const isApiRoute = path.startsWith("/api/");

  // // Check if the route is public
  // const isPublicPath = publicPaths.some(
  //   (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`),
  // );

  // // If the route is not public and not an API route, check for auth
  // if (!isPublicPath && !isApiRoute) {
  //   const { token } = getAuthCookies(request);

  //   // If no token found, redirect to login
  //   if (!token) {
  //     return NextResponse.redirect(new URL("/login", request.url));
  //   }
  // }

  // Run Auth0 middleware after our custom check
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
