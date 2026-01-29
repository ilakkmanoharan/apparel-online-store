"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumb";
import { getDepartmentBySlug } from "@/lib/config/departments";

export function useBreadcrumb(): BreadcrumbItem[] {
  const pathname = usePathname();
  return useMemo(() => {
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    if (!pathname || pathname === "/") return items;
    const segments = pathname.split("/").filter(Boolean);
    let acc = "";
    for (let i = 0; i < segments.length; i++) {
      acc += "/" + segments[i];
      const slug = segments[i];
      if (slug === "category" && segments[i + 1]) {
        const dept = getDepartmentBySlug(segments[i + 1]);
        items.push({ label: dept?.name ?? segments[i + 1], href: acc + "/" + segments[i + 1] });
        i++;
        acc += "/" + segments[i];
      } else if (slug === "products" && segments[i + 1]) {
        items.push({ label: "Product", href: acc + "/" + segments[i + 1] });
        i++;
        acc += "/" + segments[i];
      } else if (slug === "search") {
        items.push({ label: "Search" });
      } else if (slug === "cart") {
        items.push({ label: "Cart", href: "/cart" });
      } else if (slug === "checkout") {
        items.push({ label: "Checkout", href: "/checkout" });
      } else if (slug === "account") {
        items.push({ label: "Account", href: "/account" });
      } else if (i === segments.length - 1) {
        const label = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ");
        items.push({ label, href: i < segments.length - 1 ? acc : undefined });
      }
    }
    return items;
  }, [pathname]);
}
