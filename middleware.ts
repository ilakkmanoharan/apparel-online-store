import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  isLocale,
} from "@/lib/i18n/config";

function shouldIgnorePath(pathname: string): boolean {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/admin") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[^/]+$/.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (shouldIgnorePath(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const localeSegment = segments[0];

  if (localeSegment && isLocale(localeSegment)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(LOCALE_HEADER_NAME, localeSegment);

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    response.cookies.set(LOCALE_COOKIE_NAME, localeSegment, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  }

  const localeFromCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const locale = localeFromCookie && isLocale(localeFromCookie) ? localeFromCookie : DEFAULT_LOCALE;
  const localizedUrl = new URL(`/${locale}${pathname}${search}`, request.url);

  return NextResponse.redirect(localizedUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
