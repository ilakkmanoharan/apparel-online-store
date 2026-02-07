"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import { getProductById } from "@/lib/firebase/products";
import { getRecentlyViewedIds } from "@/lib/recommendations";
import { Product } from "@/types";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();
  const t = useTranslations();

  useEffect(() => {
    const ids = getRecentlyViewedIds();

    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    Promise.all(ids.map((id) => getProductById(id, locale)))
      .then((results) => setProducts(results.filter(Boolean) as Product[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [locale]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{t("product.recentlyViewed")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
