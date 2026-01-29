"use client";

import { useRouter } from "next/navigation";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment canceled</h1>
      <p className="text-gray-600 mb-6">
        Your payment was canceled. You can review your cart or try again.
      </p>
      <button
        onClick={() => router.push("/cart")}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mr-3"
      >
        Back to Cart
      </button>
      <button
        onClick={() => router.push("/")}
        className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
}

