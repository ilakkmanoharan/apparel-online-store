"use client";

import { useMemo, useState } from "react";
import { getMainNavItems, NavItem } from "@/lib/config/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import NavLink from "./NavLink";
import MegaMenu from "./MegaMenu";

export default function MainNav() {
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);
  const t = useTranslations();
  const mainNavItems = useMemo(() => getMainNavItems(t), [t]);

  return (
    <nav
      className="relative hidden md:flex items-center justify-center gap-6 py-3"
      onMouseLeave={() => setActiveItem(null)}
      aria-label={t("nav.mainNavigation")}
    >
      {mainNavItems.map((item) => (
        <NavLink key={item.label} item={item} onHover={() => setActiveItem(item)} />
      ))}
      {mainNavItems.map((item) => (
        <MegaMenu
          key={item.label}
          items={item.children || []}
          isOpen={activeItem?.label === item.label && !!item.children}
        />
      ))}
    </nav>
  );
}
