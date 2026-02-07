"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const LINK_KEYS = [
  { href: "/account", key: "profile" },
  { href: "/account/orders", key: "orders" },
  { href: "/account/addresses", key: "addresses" },
  { href: "/account/wishlist", key: "wishlist" },
  { href: "/account/rewards", key: "rewards" },
  { href: "/account/tier", key: "tierStatus" },
  { href: "/account/coupons", key: "coupons" },
  { href: "/account/shipping-preferences", key: "shipping" },
  { href: "/account/notifications", key: "notifications" },
  { href: "/account/security", key: "security" },
  { href: "/account/settings", key: "settings" },
];

export default function AccountMenu() {
  const pathname = usePathname();
  const t = useTranslations("account.menu");

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 md:hidden" aria-label={t("account")}>
      {LINK_KEYS.map((link) => (
        <LocaleLink
          key={link.href}
          href={link.href}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium border",
            pathname === link.href
              ? "bg-gray-900 text-white border-gray-900"
              : "text-gray-700 border-gray-200 hover:bg-gray-100"
          )}
        >
          {t(link.key)}
        </LocaleLink>
      ))}
    </nav>
  );
}
