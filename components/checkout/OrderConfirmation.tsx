"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";
import type { Order } from "@/types";

interface OrderConfirmationProps {
  orderId?: string;
  sessionId?: string;
}

/**
 * Format currency for display.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Format date for display.
 */
function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get status badge color.
 */
function getStatusColor(status: string): string {
  switch (status) {
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "refunded":
    case "partially_refunded":
      return "bg-yellow-100 text-yellow-800";
    case "disputed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function OrderConfirmation({
  orderId,
  sessionId,
}: OrderConfirmationProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      const id = sessionId || orderId;
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/orders?session_id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        } else if (res.status === 404) {
          // Order not found - webhook may not have run yet
          setError("pending");
        } else {
          setError("failed");
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("failed");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [sessionId, orderId]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  // Order found - show full details
  if (order) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-gray-600">
            Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono text-sm">{order.id.slice(0, 20)}...</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status.replace("_", " ")}
            </span>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-1">Order Date</p>
            <p>{formatDate(order.createdAt)}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Items</h2>
          <div className="divide-y">
            {order.items.map((item, index) => (
              <div key={index} className="py-4 flex gap-4">
                {item.product.images?.[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.selectedSize} / {item.selectedColor} &times;{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatCurrency(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white border rounded-lg shadow-sm p-6 mb-6">
            <h2 className="font-semibold mb-4">Shipping Address</h2>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/account/orders">
            <Button>View All Orders</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Order pending (webhook hasn't run yet)
  if (error === "pending") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
        <p className="text-gray-600 mb-2">
          Your payment was successful and your order is being processed.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Order details will be available shortly.
        </p>
        {sessionId && (
          <p className="text-xs text-gray-400 mb-6 font-mono">
            Session: {sessionId.slice(0, 30)}...
          </p>
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

  // Error or no session ID
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-gray-600 mb-6">
        Your order has been received and is being processed.
      </p>
      {sessionId && (
        <p className="text-sm text-gray-500 mb-6">
          Session ID: {sessionId.slice(0, 30)}...
        </p>
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
