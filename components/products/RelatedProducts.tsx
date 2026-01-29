"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { getRelatedProducts } from "@/lib/recommendations";

interface RelatedProductsProps {
  productId: string;
  category: string;
}

export default function RelatedProducts({
  productId,
  category,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRelatedProducts(productId, category)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId, category]);

  if (loading || products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
