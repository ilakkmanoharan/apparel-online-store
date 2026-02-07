"use client";

import { useMemo, useState } from "react";
import LocaleLink from "@/components/common/LocaleLink";
import { getMainNavItems } from "@/lib/config/navigation";
import { useTranslations } from "@/hooks/useTranslations";
import SearchBar from "./SearchBar";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const mainNavItems = useMemo(() => getMainNavItems(t), [t]);

  return (
    <div className="md:hidden">
      <button
        className="p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t("nav.toggleMenu")}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="border-t mt-2 pt-3 space-y-3">
          <SearchBar />
          <div className="space-y-2">
            {mainNavItems.map((item) => (
              <div key={item.label}>
                <LocaleLink
                  href={item.href || "#"}
                  className="block py-2 text-gray-800 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </LocaleLink>
                {item.children && (
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <LocaleLink
                        key={child.href}
                        href={child.href}
                        className="block text-sm text-gray-600 py-0.5"
                        onClick={() => setIsOpen(false)}
                      >
                        {child.label}
                      </LocaleLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
