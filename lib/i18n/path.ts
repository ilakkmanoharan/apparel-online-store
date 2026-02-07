import type { UrlObject } from "url";
import { isLocale } from "@/lib/i18n/config";
import type { Locale } from "@/types/i18n";

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#");
}

function normalizeInternalPath(path: string): string {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function prefixPathWithLocale(path: string, locale: Locale): string {
  if (isExternalHref(path)) {
    return path;
  }

  const normalizedPath = normalizeInternalPath(path);
  const [pathname, query] = normalizedPath.split("?");
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] && isLocale(segments[0])) {
    return normalizedPath;
  }

  const localizedPath = `/${locale}${pathname === "/" ? "" : pathname}`;

  return query ? `${localizedPath}?${query}` : localizedPath;
}

export function removeLocalePrefix(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments[0] || !isLocale(segments[0])) {
    return pathname;
  }

  const withoutLocale = `/${segments.slice(1).join("/")}`;

  return withoutLocale === "/" ? "/" : withoutLocale;
}

export function localizeHref(href: string | UrlObject, locale: Locale): string | UrlObject {
  if (typeof href === "string") {
    return prefixPathWithLocale(href, locale);
  }

  if (!href.pathname || typeof href.pathname !== "string") {
    return href;
  }

  return {
    ...href,
    pathname: prefixPathWithLocale(href.pathname, locale),
  };
}
