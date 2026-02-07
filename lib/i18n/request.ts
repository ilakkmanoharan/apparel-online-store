import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_HEADER_NAME,
  isLocale,
} from "@/lib/i18n/config";
import type { Locale, Messages } from "@/types/i18n";

const messageLoaders: Record<Locale, () => Promise<Messages>> = {
  en: async () => (await import("@/messages/en.json")).default as Messages,
  es: async () => (await import("@/messages/es.json")).default as Messages,
  fr: async () => (await import("@/messages/fr.json")).default as Messages,
  de: async () => (await import("@/messages/de.json")).default as Messages,
};

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];

  if (segment && isLocale(segment)) {
    return segment;
  }

  return null;
}

export function getLocaleFromRequest(request: NextRequest): Locale {
  const fromPath = getLocaleFromPathname(request.nextUrl.pathname);

  if (fromPath) {
    return fromPath;
  }

  const fromCookie = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (fromCookie && isLocale(fromCookie)) {
    return fromCookie;
  }

  const fromHeader = request.headers.get(LOCALE_HEADER_NAME);
  if (fromHeader && isLocale(fromHeader)) {
    return fromHeader;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const normalized = acceptLanguage
    .split(",")
    .map((entry) => entry.split(";")[0]?.trim().slice(0, 2).toLowerCase())
    .find((entry): entry is Locale => Boolean(entry && isLocale(entry)));

  return normalized ?? DEFAULT_LOCALE;
}

export async function getMessages(locale: Locale): Promise<Messages> {
  const loader = messageLoaders[locale] ?? messageLoaders[DEFAULT_LOCALE];

  try {
    return await loader();
  } catch {
    return messageLoaders[DEFAULT_LOCALE]();
  }
}

export function getLocaleFromServerRequest(): Locale {
  const requestHeaders = headers();
  const requestCookies = cookies();

  const fromHeader = requestHeaders.get(LOCALE_HEADER_NAME);
  if (fromHeader && isLocale(fromHeader)) {
    return fromHeader;
  }

  const fromCookie = requestCookies.get(LOCALE_COOKIE_NAME)?.value;
  if (fromCookie && isLocale(fromCookie)) {
    return fromCookie;
  }

  const referer = requestHeaders.get("referer");
  if (referer) {
    try {
      const locale = getLocaleFromPathname(new URL(referer).pathname);
      if (locale) {
        return locale;
      }
    } catch {
      // Ignore malformed referer.
    }
  }

  return DEFAULT_LOCALE;
}
