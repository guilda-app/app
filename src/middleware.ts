
import { NextResponse } from "next/server";
import Cookies from "js-cookie";
import { getTokenFromCookies } from "@/lib/auth";

export default async function middleware(request) {
  let token = await getTokenFromCookies(request.cookies);
  const isIndexpage = request.nextUrl.pathname === "/";
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route));
  const isGuestRoute = guestRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (!token && (isAuthRoute)) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("callbackUrl", request.nextUrl.href);
    return NextResponse.redirect(redirectUrl);
  }

  if (token) {
    if (isIndexpage || isGuestRoute) {
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }
}

const authRoutes = ["/app"];
const guestRoutes = ["/login", "/account-creation", "/confirm-account", "/password-reset", "/register"];