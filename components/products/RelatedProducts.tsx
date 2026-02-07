"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import { getRelatedProducts } from "@/lib/recommendations";
import { Product } from "@/types";

interface RelatedProductsProps {
  productId: string;
  category: string;
}

export default function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();
  const t = useTranslations();

  useEffect(() => {
    getRelatedProducts(productId, category, locale)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId, category, locale]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{t("product.youMayAlsoLike")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
