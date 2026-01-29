"use client";

import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";

interface Props {
  products: Product[];
}

export default function SearchResults({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

