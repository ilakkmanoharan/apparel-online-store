"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { localizeHref } from "@/lib/i18n/path";
import { useI18n } from "@/components/common/I18nProvider";

export function useLocaleRouter() {
  const router = useRouter();
  const { locale } = useI18n();

  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: Parameters<typeof router.push>[1]) => {
        router.push(localizeHref(href, locale) as string, options);
      },
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) => {
        router.replace(localizeHref(href, locale) as string, options);
      },
      prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) => {
        router.prefetch(localizeHref(href, locale) as string, options);
      },
    }),
    [locale, router]
  );
}
