"use client";

import { usePathname } from "next/navigation";
import { mainNavItems } from "@/lib/config/navigation";
import { departments } from "@/lib/config/departments";

export function useNavigation() {
  const pathname = usePathname();

  const currentDepartment = departments.find((d) => pathname?.startsWith(d.href) || pathname === d.href);
  const currentNavItem = mainNavItems.find((n) => pathname?.startsWith(n.href ?? "") || pathname === n.href);

  return {
    pathname,
    currentDepartment,
    currentNavItem,
    mainNavItems,
    departments,
  };
}
