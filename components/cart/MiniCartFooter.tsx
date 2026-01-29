"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MiniCartFooterProps {
  subtotal: number;
  itemCount: number;
  onClose?: () => void;
  className?: string;
}

export default function MiniCartFooter({
  subtotal,
  itemCount,
  onClose,
  className,
}: MiniCartFooterProps) {
  return (
    <div className={cn("border-t border-gray-200 pt-4 space-y-3", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
        <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
      </div>
      <Link
        href="/cart"
        onClick={onClose}
        className="block w-full text-center bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
        View cart
      </Link>
      <Link
        href="/checkout"
        onClick={onClose}
        className="block w-full text-center border border-gray-900 text-gray-900 font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Checkout
      </Link>
    </div>
  );
}
