"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/rewards", label: "Rewards" },
  { href: "/account/tier", label: "Tier status" },
  { href: "/account/coupons", label: "Coupons" },
  { href: "/account/shipping-preferences", label: "Shipping" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/security", label: "Security" },
  { href: "/account/settings", label: "Account settings" },
];

export default function AccountMenu() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 md:hidden" aria-label="Account">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium border",
            pathname === link.href
              ? "bg-gray-900 text-white border-gray-900"
              : "text-gray-700 border-gray-200 hover:bg-gray-100"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

