"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductListViewProps {
  products: Product[];
}

export default function ProductListView({ products }: ProductListViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    setAddingId(product.id);
    const size = product.sizes[0] || "One Size";
    const color = product.colors[0] || "Default";
    addItem(product, size, color);
    setTimeout(() => setAddingId(null), 500);
  };

  return (
    <ul className="divide-y divide-gray-200">
      {products.map((product) => (
        <li key={product.id} className="py-6 flex gap-6">
          <Link href={`/products/${product.id}`} className="flex-shrink-0 w-32 aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
            )}
          </Link>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-gray-600">{product.name}</h3>
            </Link>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.rating != null && (
                <span className="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock || addingId === product.id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {addingId === product.id ? "Added" : product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
