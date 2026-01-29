"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingCartIcon,
  PhotoIcon,
  TagIcon,
  Cog6ToothIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  DocumentMagnifyingGlassIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin", icon: HomeIcon },
  { label: "Products", href: "/admin/products", icon: CubeIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCartIcon },
  { label: "Inventory", href: "/admin/inventory", icon: ClipboardDocumentListIcon },
  { label: "Users", href: "/admin/users", icon: UserGroupIcon },
  { label: "Campaigns", href: "/admin/campaigns", icon: PhotoIcon },
  { label: "Promos", href: "/admin/promos", icon: TagIcon },
  { label: "Analytics", href: "/admin/analytics", icon: ChartBarIcon },
  { label: "Reports", href: "/admin/reports", icon: DocumentChartBarIcon },
  { label: "Audit log", href: "/admin/audit", icon: DocumentMagnifyingGlassIcon },
  { label: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Link href="/admin" className="font-bold text-lg">
          Admin
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
