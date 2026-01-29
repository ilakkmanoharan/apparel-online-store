"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/config/navigation";

interface SubcategoryDropdownProps {
  item: NavItem;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubcategoryDropdown({ item, isOpen, onClose }: SubcategoryDropdownProps) {
  if (!isOpen || !item.children?.length) return null;
  return (
    <div className="absolute left-0 top-full mt-0 w-64 rounded-lg border bg-white shadow-lg z-50 py-2">
      {item.children.map((child) => (
        <Link
          key={child.href}
          href={child.href}
          onClick={onClose}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          {child.label}
          {child.badge && <span className="ml-2 text-xs bg-gray-900 text-white px-1.5 py-0.5 rounded">{child.badge}</span>}
        </Link>
      ))}
    </div>
  );
}
