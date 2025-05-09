import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to check if a user is logged in before accessing the dashboard
 */
export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("session")?.value;

  if (request.nextUrl.pathname.startsWith("/dashboard") && !sessionId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
