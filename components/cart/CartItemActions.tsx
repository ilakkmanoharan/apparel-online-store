"use client";

import { TrashIcon, HeartIcon } from "@heroicons/react/24/outline";
import { CartItem as CartItemType } from "@/types";
import { cn } from "@/lib/utils";

interface CartItemActionsProps {
  item: CartItemType;
  onRemove: () => void;
  onMoveToWishlist?: () => void;
  className?: string;
}

export default function CartItemActions({
  item,
  onRemove,
  onMoveToWishlist,
  className,
}: CartItemActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {onMoveToWishlist && (
        <button
          type="button"
          onClick={onMoveToWishlist}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          aria-label="Move to wishlist"
        >
          <HeartIcon className="w-5 h-5" />
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
        aria-label="Remove item"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
