import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STR = process.env.JWT_SECRET;
const JWT_SECRET = new TextEncoder().encode(
  JWT_SECRET_STR || "dresscode-laundry-development-secret-key-only"
);

const COOKIE_NAME = "dc_auth_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define routes
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";
  const isDashboardLoginRoute = pathname === "/dashboard/login";

  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Redirect legacy login to new dashboard login
  if (isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  // Protect dashboard and admin routes
  if (isDashboardRoute || isAdminRoute) {
    // Allow dashboard login to be public
    if (isDashboardLoginRoute) {
      if (token) {
        try {
          await jwtVerify(token, JWT_SECRET);
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } catch {
          // Bad token, allow login page but clear it
          const response = NextResponse.next();
          response.cookies.delete(COOKIE_NAME);
          return response;
        }
      }
      return NextResponse.next();
    }

    // Require token for everything else in dashboard/admin
    if (!token) {
      const loginUrl = new URL("/dashboard/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Middleware JWT verification failed:", error);
      const response = NextResponse.redirect(
        new URL("/dashboard/login", request.url)
      );
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login"],
};
