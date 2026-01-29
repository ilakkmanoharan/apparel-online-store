"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCartStore } from "@/store/cartStore";

interface CartIconProps {
  onOpenDrawer?: () => void;
}

export default function CartIcon({ onOpenDrawer }: CartIconProps) {
  const cartCount = useCartStore((state) => state.getItemCount());

  if (onOpenDrawer) {
    return (
      <button
        type="button"
        onClick={onOpenDrawer}
        className="relative p-2 text-gray-700 hover:text-gray-900"
        aria-label={`Cart, ${cartCount} items`}
      >
        <ShoppingBagIcon className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <a href="/cart" className="relative p-2">
      <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </a>
  );
}
