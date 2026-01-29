"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { Product } from "@/types";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  className?: string;
}

export default function WishlistButton({ product, className }: WishlistButtonProps) {
  const { has, toggle } = useWishlistStore();
  const isInWishlist = has(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggle(product);
      }}
      className={cn(
        "p-2 rounded-full transition-colors",
        isInWishlist ? "text-red-500" : "text-gray-600 hover:text-gray-900",
        className
      )}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <HeartIconSolid className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  );
}
