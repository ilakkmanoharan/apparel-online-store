"use client";

import { useState } from "react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";
import AvailabilityBadge from "./AvailabilityBadge";
import { cn } from "@/lib/utils";

interface AddToCartBarProps {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  className?: string;
}

export default function AddToCartBar({
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  quantity = 1,
  onQuantityChange,
  className,
}: AddToCartBarProps) {
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!product.inStock || !selectedSize || !selectedColor) return;
    setAdding(true);
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor);
    }
    setTimeout(() => setAdding(false), 500);
  };

  const canAdd = product.inStock && selectedSize && selectedColor;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <AvailabilityBadge inStock={product.inStock} stockCount={product.stockCount} />
      </div>
      {product.sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={cn(
                  "px-4 py-2 border rounded-lg text-sm font-medium",
                  selectedSize === size
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 hover:border-gray-900"
                )}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {product.colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onColorChange(color)}
                className={cn(
                  "px-4 py-2 border rounded-lg text-sm font-medium capitalize",
                  selectedColor === color
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 hover:border-gray-900"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      {onQuantityChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <select
            value={quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={handleAddToCart}
        disabled={!canAdd || adding}
        className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        <ShoppingBagIcon className="w-5 h-5" />
        {adding ? "Added!" : "Add to Cart"}
      </button>
    </div>
  );
}
