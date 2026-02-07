"use client";

import LocaleLink from "@/components/common/LocaleLink";
import { NavItem } from "@/lib/config/navigation";

interface NavLinkProps {
  item: NavItem;
  onHover?: () => void;
}

export default function NavLink({ item, onHover }: NavLinkProps) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      className="relative px-2 py-1 text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      <LocaleLink href={item.href || "#"} className="inline-flex items-center gap-1">
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            {item.badge}
          </span>
        )}
      </LocaleLink>
    </button>
  );
}

