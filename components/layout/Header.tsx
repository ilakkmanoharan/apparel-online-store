"use client";

import { useState } from "react";
import LocaleLink from "@/components/common/LocaleLink";
import { useTranslations } from "@/hooks/useTranslations";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import UserMenu from "./UserMenu";
import TopBanner from "./TopBanner";
import MainNav from "./MainNav";
import MobileNav from "./MobileNav";
import MiniCartDrawer from "@/components/cart/MiniCartDrawer";

export default function Header() {
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <TopBanner />
      <div className="border-b">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <LocaleLink href="/" className="text-2xl font-bold text-gray-900">
            {t("brand.name")}
          </LocaleLink>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <UserMenu />
            <CartIcon onOpenDrawer={() => setCartDrawerOpen(true)} />
            <MobileNav />
          </div>
        </div>
      </div>
      <MainNav />
      <MiniCartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
}
