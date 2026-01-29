"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "@/types";
import { usePromoStore } from "@/store/promoStore";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const { applyDiscount } = usePromoStore();
  const total = applyDiscount(subtotal);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <ul className="divide-y divide-gray-200 mb-4 space-y-3">
        {items.map((item, index) => (
          <li key={`${item.product.id}-${index}`} className="flex gap-3 py-3">
            <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  —
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product.id}`}
                className="text-sm font-medium text-gray-900 hover:text-gray-600 line-clamp-2"
              >
                {item.product.name}
              </Link>
              <p className="text-xs text-gray-500">
                Qty {item.quantity} · {item.selectedSize} · {item.selectedColor}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900 flex-shrink-0">
              {formatPrice(item.product.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
