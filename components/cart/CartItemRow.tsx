"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

interface CartItemRowProps {
  item: CartItemType;
  onUpdateQuantity: (delta: number) => void;
  onRemove: () => void;
}

export default function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-200 last:border-0">
      <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
          {item.product.images[0] ? (
            <Image
              src={item.product.images[0]}
              alt={item.product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <h3 className="font-medium text-gray-900 truncate hover:text-gray-600">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500">
          {item.selectedSize} · {item.selectedColor}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <button
            type="button"
            onClick={() => onUpdateQuantity(-1)}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(1)}
            className="p-1 rounded hover:bg-gray-100"
            aria-label="Increase quantity"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="ml-2 p-1 text-red-600 hover:text-red-800"
            aria-label="Remove item"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-gray-900">
          {formatPrice(item.product.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
