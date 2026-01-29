"use client";

import { useState } from "react";
import type { Order } from "@/types";

interface OrderStatusSelectProps {
  value: Order["status"];
  onChange: (status: Order["status"]) => Promise<void>;
}

const STATUS_OPTIONS: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function OrderStatusSelect({ value, onChange }: OrderStatusSelectProps) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as Order["status"];
    setLoading(true);
    try {
      await onChange(status);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={loading}
      className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium capitalize disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}
