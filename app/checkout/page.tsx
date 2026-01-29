"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Address } from "@/types";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import ShippingAddressForm from "@/components/checkout/ShippingAddressForm";
import OrderSummary from "@/components/checkout/OrderSummary";

function createEmptyAddress(): Address {
  return {
    id: "temp",
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: true,
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCartStore();
  const [address, setAddress] = useState<Address>(createEmptyAddress());
  const [loading, setLoading] = useState(false);
  const subtotal = getTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: address,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.url) {
        console.error("Failed to create checkout session", data);
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600 mb-4">Your cart is empty.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <CheckoutSteps currentStep={1} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form className="lg:col-span-2 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shipping Address</h2>
            <ShippingAddressForm address={address} onChange={setAddress} />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Redirecting to Stripe..." : "Pay with Card (Stripe)"}
            </button>
          </div>
        </form>
        <div className="lg:col-span-1">
          <OrderSummary items={items} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
