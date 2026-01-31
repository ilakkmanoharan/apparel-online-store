"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

interface OrderConfirmationProps {
  orderId?: string;
  sessionId?: string;
}

interface OrderData {
  id: string;
  items: Array<{
    product: { name: string; images?: string[] };
    quantity: number;
    selectedSize: string;
    selectedColor: string;
  }>;
  total: number;
  shippingAddress?: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  status: string;
}

export default function OrderConfirmation({
  orderId,
  sessionId,
}: OrderConfirmationProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders?session_id=${sessionId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [sessionId]);

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>

      {loading && <p className="text-gray-600 mb-6">Loading order details...</p>}

      {!loading && order && (
        <div className="max-w-md mx-auto text-left mb-8">
          <p className="text-sm text-gray-500 mb-1">Order ID: {order.id}</p>
          <p className="text-sm text-gray-500 mb-4">Status: {order.status}</p>

          <div className="border rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-2">Items</h2>
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between py-1 text-sm">
                <span>
                  {item.product.name} &mdash; {item.selectedSize} / {item.selectedColor} &times;{" "}
                  {item.quantity}
                </span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="border rounded-lg p-4">
              <h2 className="font-semibold mb-1">Shipping</h2>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.street}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}, {order.shippingAddress.country}
              </p>
            </div>
          )}
        </div>
      )}

      {!loading && !order && (
        <div className="mb-6">
          <p className="text-gray-600">
            Your order has been received and is being processed.
          </p>
          {(orderId || sessionId) && (
            <p className="text-sm text-gray-500 mt-2">
              Reference: {orderId || sessionId}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/account/orders">
          <Button>View Orders</Button>
        </Link>
        <Link href="/">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
