"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { getRecentlyViewedIds } from "@/lib/recommendations";
import { getProductById } from "@/lib/firebase/products";

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(ids.map((id) => getProductById(id)))
      .then((results) => setProducts(results.filter(Boolean) as Product[]))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
