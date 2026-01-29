"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import type { Address } from "@/types";
import { cn } from "@/lib/utils";

interface GuestCheckoutFormProps {
  onSubmit: (email: string, address: Omit<Address, "id" | "isDefault">) => void;
  loading?: boolean;
  error?: string;
  className?: string;
}

const defaultAddress: Omit<Address, "id" | "isDefault"> = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
};

export default function GuestCheckoutForm({
  onSubmit,
  loading,
  error,
  className,
}: GuestCheckoutFormProps) {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState(defaultAddress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email, address);
  };

  const update = (field: keyof typeof defaultAddress, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
      <Input label="Full name" value={address.fullName} onChange={(e) => update("fullName", e.target.value)} required />
      <Input label="Street address" value={address.street} onChange={(e) => update("street", e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <Input label="City" value={address.city} onChange={(e) => update("city", e.target.value)} required />
        <Input label="State" value={address.state} onChange={(e) => update("state", e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="ZIP code" value={address.zipCode} onChange={(e) => update("zipCode", e.target.value)} required />
        <Input label="Country" value={address.country} onChange={(e) => update("country", e.target.value)} required />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium">
        {loading ? "Processing..." : "Continue to payment"}
      </button>
    </form>
  );
}
