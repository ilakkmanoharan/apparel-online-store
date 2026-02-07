"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import WomenFashionGallery from "@/components/category/WomenFashionGallery";
import { useTranslations } from "@/hooks/useTranslations";
import { getCategoryBySlug } from "@/lib/firebase/categories";
import { getProductsByCategory } from "@/lib/firebase/products";
import { Product } from "@/types";

interface PageProps {
  params: { locale: string; slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  const { locale, slug } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();
  const title = useMemo(
    () => categoryName ?? t(`category.slugs.${slug}`),
    [categoryName, slug, t]
  );

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [category, categoryProducts] = await Promise.all([
          getCategoryBySlug(slug, locale),
          getProductsByCategory(slug, locale),
        ]);
        setCategoryName(category?.name ?? null);
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setCategoryName(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [locale, slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">{title}</h1>
        {slug === "women" && <WomenFashionGallery />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{title}</h1>
      {slug === "women" && <WomenFashionGallery />}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">{t("category.noProducts")}</p>
      )}
    </div>
  );
}
