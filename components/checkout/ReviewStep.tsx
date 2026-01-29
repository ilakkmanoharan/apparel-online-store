"use client";

import type { Address } from "@/types";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
  shippingAddress: Address | null;
  shippingMethodLabel?: string;
  items: CartItem[];
  subtotal: number;
  shippingAmount?: number;
  taxAmount?: number;
  total: number;
  className?: string;
}

function formatAddress(a: Address): string {
  return [a.fullName, a.street, `${a.city}, ${a.state} ${a.zipCode}`, a.country]
    .filter(Boolean)
    .join("\n");
}

export default function ReviewStep({
  shippingAddress,
  shippingMethodLabel,
  items,
  subtotal,
  shippingAmount = 0,
  taxAmount = 0,
  total,
  className,
}: ReviewStepProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold text-gray-900">Review your order</h2>

      {shippingAddress && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">Shipping address</p>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
            {formatAddress(shippingAddress)}
          </pre>
        </div>
      )}

      {shippingMethodLabel && (
        <div>
          <p className="text-sm font-medium text-gray-700">Shipping</p>
          <p className="text-sm text-gray-600">{shippingMethodLabel}</p>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-gray-900">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {shippingAmount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{formatPrice(shippingAmount)}</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>{formatPrice(taxAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-gray-900 pt-2">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
