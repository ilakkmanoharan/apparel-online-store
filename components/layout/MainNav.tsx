"use client";

import { useState } from "react";
import { mainNavItems, NavItem } from "@/lib/config/navigation";
import NavLink from "./NavLink";
import MegaMenu from "./MegaMenu";

export default function MainNav() {
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);

  return (
    <nav
      className="relative hidden md:flex items-center justify-center gap-6 py-3"
      onMouseLeave={() => setActiveItem(null)}
    >
      {mainNavItems.map((item) => (
        <div key={item.label} className="relative">
          <NavLink
            item={item}
            onHover={() => setActiveItem(item)}
          />
          <MegaMenu
            items={item.children || []}
            isOpen={activeItem?.label === item.label && !!item.children}
          />
        </div>
      ))}
    </nav>
  );
}

