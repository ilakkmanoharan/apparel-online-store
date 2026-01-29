"use client";

import type { ReturnItem } from "@/types/returns";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ReturnItemListProps {
  order: Order;
  selectedItems: ReturnItem[];
  onToggleItem: (productId: string, variantKey: string, quantity: number, reason: ReturnItem["reason"], reasonDetail?: string) => void;
  onReasonChange: (productId: string, variantKey: string, reason: ReturnItem["reason"], reasonDetail?: string) => void;
}

export default function ReturnItemList({
  order,
  selectedItems,
  onToggleItem,
  onReasonChange,
}: ReturnItemListProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {order.items.map((cartItem, index) => {
        const variantKey = `${cartItem.selectedSize}-${cartItem.selectedColor}`;
        const selected = selectedItems.find(
          (s) => s.productId === cartItem.product.id && s.variantKey === variantKey
        );
        return (
          <li key={`${cartItem.product.id}-${variantKey}-${index}`} className="py-4 flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <input
                type="checkbox"
                checked={!!selected}
                onChange={(e) => {
                  if (e.target.checked) {
                    onToggleItem(cartItem.product.id, variantKey, cartItem.quantity, "changed_mind");
                  } else {
                    onToggleItem(cartItem.product.id, variantKey, 0, "changed_mind");
                  }
                }}
                className="mt-1 rounded border-gray-300"
              />
              <div>
                <p className="font-medium text-gray-900">{cartItem.product.name}</p>
                <p className="text-sm text-gray-500">
                  {cartItem.selectedSize} · {cartItem.selectedColor} · Qty {cartItem.quantity}
                </p>
                <p className="text-sm text-gray-600 mt-1">{formatPrice(cartItem.product.price * cartItem.quantity)}</p>
              </div>
            </div>
            {selected && (
              <div className="text-sm">
                <label className="block text-gray-600 mb-1">Reason</label>
                <select
                  value={selected.reason}
                  onChange={(e) => onReasonChange(cartItem.product.id, variantKey, e.target.value as ReturnItem["reason"])}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="wrong_size">Wrong size</option>
                  <option value="wrong_item">Wrong item</option>
                  <option value="defective">Defective</option>
                  <option value="not_as_described">Not as described</option>
                  <option value="changed_mind">Changed mind</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
