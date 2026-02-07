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
  { href: "/account/tier", key: "tier" },
  { href: "/account/coupons", key: "coupons" },
  { href: "/account/shipping-preferences", key: "shipping" },
  { href: "/account/notifications", key: "notifications" },
  { href: "/account/security", key: "security" },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account.menu");

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <nav className="space-y-1" aria-label={t("account")}>
        {LINK_KEYS.map((link) => (
          <LocaleLink
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {t(link.key)}
          </LocaleLink>
        ))}
      </nav>
    </aside>
  );
}
