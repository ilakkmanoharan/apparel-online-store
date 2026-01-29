"use client";

import Link from "next/link";
import { NavChildItem } from "@/lib/config/navigation";

interface MegaMenuProps {
  items: NavChildItem[];
  isOpen: boolean;
}

export default function MegaMenu({ items, isOpen }: MegaMenuProps) {
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="absolute inset-x-0 top-full bg-white shadow-lg border-t border-gray-100">
      <div className="container mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className="group block rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-700">
                {child.label}
              </p>
              {child.badge && (
                <span className="ml-2 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
                  {child.badge}
                </span>
              )}
            </div>
            {child.description && (
              <p className="mt-1 text-xs text-gray-500">
                {child.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

