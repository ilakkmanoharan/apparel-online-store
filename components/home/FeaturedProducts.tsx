"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import { getFeaturedProducts } from "@/lib/firebase/products";
import { Product } from "@/types";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { locale } = useI18n();
  const t = useTranslations();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const featuredProducts = await getFeaturedProducts(locale);
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [locale]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("home.featuredProducts")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t("home.featuredProducts")}</h2>
          <p className="text-center text-gray-600">{t("home.noFeaturedProducts")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t("home.featuredProducts")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
