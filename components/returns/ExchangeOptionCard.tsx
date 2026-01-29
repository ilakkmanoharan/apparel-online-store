"use client";

import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ExchangeOptionCardProps {
  product: Product;
  onSelect: () => void;
  selected?: boolean;
}

export default function ExchangeOptionCard({ product, onSelect, selected }: ExchangeOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`text-left rounded-lg border-2 p-4 transition-colors ${
        selected ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {product.images?.[0] && (
        <div className="aspect-square relative rounded overflow-hidden bg-gray-100 mb-2">
          <img src={product.images[0]} alt={product.name} className="object-cover w-full h-full" />
        </div>
      )}
      <p className="font-medium text-gray-900 line-clamp-2">{product.name}</p>
      <p className="text-sm font-semibold text-gray-900 mt-1">{formatPrice(product.price)}</p>
      {selected && <p className="text-xs text-green-600 mt-1">Selected for exchange</p>}
    </button>
  );
}
