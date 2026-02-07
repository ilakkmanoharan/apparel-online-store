"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { removeLocalePrefix } from "@/lib/i18n/path";

export function useLocalePath() {
  const pathname = usePathname();

  return useMemo(() => removeLocalePrefix(pathname), [pathname]);
}
