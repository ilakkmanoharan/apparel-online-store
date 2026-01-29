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
  { href: "/account/tier", label: "Tier" },
  { href: "/account/coupons", label: "Coupons" },
  { href: "/account/shipping-preferences", label: "Shipping" },
  { href: "/account/notifications", label: "Notifications" },
  { href: "/account/security", label: "Security" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <nav className="space-y-1" aria-label="Account">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "block px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === link.href
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
