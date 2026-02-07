"use client";

import LocaleLink from "@/components/common/LocaleLink";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";

interface OrderDetailProps {
  order: Order;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium text-gray-900 capitalize">{order.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Payment</p>
          <p className="font-medium text-gray-900 capitalize">{order.paymentStatus}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium text-gray-900">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 mb-2">Items</h2>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item, index) => (
            <li key={`${item.product.id}-${index}`} className="flex gap-4 py-3">
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
                <LocaleLink
                  href={`/products/${item.product.id}`}
                  className="font-medium text-gray-900 hover:text-gray-600"
                >
                  {item.product.name}
                </LocaleLink>
                <p className="text-sm text-gray-500">
                  Qty {item.quantity} · {item.selectedSize} · {item.selectedColor}
                </p>
              </div>
              <p className="font-medium text-gray-900 flex-shrink-0">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {order.shippingAddress && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-2">Shipping Address</h2>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.street}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zipCode}
            <br />
            {order.shippingAddress.country}
          </p>
        </div>
      )}

      <div className="border-t pt-4 flex justify-between font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
