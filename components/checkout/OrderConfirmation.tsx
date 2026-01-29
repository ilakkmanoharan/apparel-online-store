"use client";

import Link from "next/link";
import Button from "@/components/common/Button";

interface OrderConfirmationProps {
  orderId?: string;
  sessionId?: string;
}

export default function OrderConfirmation({
  orderId,
  sessionId,
}: OrderConfirmationProps) {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">Thank you for your order!</h1>
      <p className="text-gray-600 mb-6">
        Your order has been received and is being processed.
      </p>
      {orderId && (
        <p className="text-sm text-gray-500 mb-2">Order ID: {orderId}</p>
      )}
      {sessionId && (
        <p className="text-sm text-gray-500 mb-6">Stripe session: {sessionId}</p>
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
