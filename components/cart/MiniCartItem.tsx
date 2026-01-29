"use client";

import Link from "next/link";
import Image from "next/image";
import { CartItem as CartItemType } from "@/types";
import { formatPrice } from "@/lib/utils";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface MiniCartItemProps {
  item: CartItemType;
  onUpdateQuantity: (delta: number) => void;
  onRemove: () => void;
  compact?: boolean;
  className?: string;
}

export default function MiniCartItem({
  item,
  onUpdateQuantity,
  onRemove,
  compact,
  className,
}: MiniCartItemProps) {
  const lineTotal = item.product.price * item.quantity;

  return (
    <div className={cn("flex gap-3 py-3 border-b border-gray-100 last:border-0", className)}>
      <Link
        href={`/products/${item.product.id}`}
        className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden"
      >
        {item.product.images[0] ? (
          <Image
            src={item.product.images[0]}
            alt={item.product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`}>
          <p className="font-medium text-gray-900 truncate hover:text-gray-600 text-sm">
            {item.product.name}
          </p>
        </Link>
        <p className="text-xs text-gray-500">
          {item.selectedSize} · {item.selectedColor}
        </p>
        {!compact && (
          <div className="flex items-center gap-1 mt-1">
            <button
              type="button"
              onClick={() => onUpdateQuantity(-1)}
              className="p-1 rounded hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-6 text-center text-sm">{item.quantity}</span>
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
              aria-label="Remove"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-medium text-gray-900 text-sm">{formatPrice(lineTotal)}</p>
      </div>
    </div>
  );
}
