"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import type { ProductRecommendation } from "@/types/recommendation";

interface RecommendedProductsProps {
  productId: string;
}

export default function RecommendedProducts({ productId }: RecommendedProductsProps) {
  const [items, setItems] = useState<ProductRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();
  const t = useTranslations();

  useEffect(() => {
    fetch(`/api/products/${productId}/recommendations?locale=${encodeURIComponent(locale)}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ProductRecommendation[]) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [locale, productId]);

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold mb-4">{t("product.youMayAlsoLike")}</h2>
      <p className="text-gray-600 text-sm mb-6">{t("product.recommendationDescription")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((recommendation) => (
          <ProductCard key={recommendation.product.id} product={recommendation.product} />
        ))}
      </div>
    </section>
  );
}
