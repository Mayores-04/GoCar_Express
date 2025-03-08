import { NextRequest, NextResponse } from "next/server";
import Cookies from "js-cookie";

export function middleware(req) {
  const token = req.cookies.get("adminToken")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/forbidden", req.url)); // Redirect to forbidden page
  }

  return NextResponse.next();
}

// Apply middleware to all /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
