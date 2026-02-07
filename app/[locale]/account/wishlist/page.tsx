"use client";

import { useEffect } from "react";
import LocaleLink from "@/components/common/LocaleLink";
import Button from "@/components/common/Button";
import ProductCard from "@/components/products/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const { items } = useWishlistStore();
  const menuT = useTranslations("account.menu");
  const t = useTranslations();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (!authLoading && !user) {
    return null;
  }

  if (authLoading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{menuT("wishlist")}</h1>
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p className="mb-4">{t("wishlist.empty")}</p>
          <LocaleLink href="/">
            <Button>{t("common.continueShopping")}</Button>
          </LocaleLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
