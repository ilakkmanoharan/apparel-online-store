"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [adding, setAdding] = useState(false);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    
    setAdding(true);
    // Use default size and color if available
    const size = product.sizes[0] || "One Size";
    const color = product.colors[0] || "Default";
    addItem(product, size, color);
    
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{discount}%
            </span>
          )}
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist
            }}
            aria-label="Add to wishlist"
          >
            <HeartIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={!product.inStock || adding}
        >
          <ShoppingBagIcon className="w-5 h-5" />
          {adding ? "Added!" : product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </motion.div>
  );
}
