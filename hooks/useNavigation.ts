"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { getMainNavItems } from "@/lib/config/navigation";
import { departments } from "@/lib/config/departments";
import { useTranslations } from "@/hooks/useTranslations";

function pathMatchesHref(pathname: string | null, href: string | undefined): boolean {
  if (!pathname || !href) return false;
  if (pathname === href) return true;
  // Locale-prefixed routes: /en/category/women matches href /category/women
  return pathname.includes(href);
}

export function useNavigation() {
  const pathname = usePathname();
  const t = useTranslations();
  const mainNavItems = useMemo(() => getMainNavItems(t), [t]);

  const currentDepartment = useMemo(
    () => departments.find((d) => pathMatchesHref(pathname, d.href)),
    [pathname]
  );
  const currentNavItem = useMemo(
    () => mainNavItems.find((n) => pathMatchesHref(pathname, n.href)),
    [pathname, mainNavItems]
  );

  return {
    pathname,
    currentDepartment,
    currentNavItem,
    mainNavItems,
    departments,
  };
}
