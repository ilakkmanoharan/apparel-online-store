"use client";

import type { Order } from "@/types";
import { formatPrice } from "@/lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";

interface OrderDetailViewProps {
  order: Order;
  onStatusChange?: (status: Order["status"]) => Promise<void>;
}

function formatDate(d: Date | { toDate?: () => Date } | unknown): string {
  if (!d) return "—";
  const date = d instanceof Date ? d : (d as { toDate?: () => Date }).toDate?.() ?? new Date();
  return date.toLocaleDateString();
}

export default function OrderDetailView({ order, onStatusChange }: OrderDetailViewProps) {
  const address = order.shippingAddress;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(-8)}</h2>
          <p className="text-sm text-gray-500">Placed {formatDate(order.createdAt)}</p>
        </div>
        {onStatusChange && (
          <OrderStatusSelect value={order.status} onChange={onStatusChange} />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Shipping address</h3>
          <p className="text-sm text-gray-600">
            {address.fullName}<br />
            {address.street}<br />
            {address.city}, {address.state} {address.zipCode}<br />
            {address.country}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-2">Payment</h3>
          <p className="text-sm text-gray-600">{order.paymentMethod}</p>
          <p className="text-sm text-gray-500 mt-1">Status: {order.paymentStatus}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <h3 className="font-medium text-gray-900 px-4 py-2 border-b border-gray-200">Items</h3>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item, i) => (
            <li key={i} className="px-4 py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-gray-500">
                  Qty {item.quantity} · {item.selectedSize} · {item.selectedColor}
                </p>
              </div>
              <p className="font-medium text-gray-900">{formatPrice(item.product.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="px-4 py-3 border-t border-gray-200 flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
