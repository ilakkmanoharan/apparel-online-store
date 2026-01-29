"use client";

import { useState } from "react";
import PickupOptionCard from "./PickupOptionCard";
import type { StoreLocation } from "@/types/store";

interface StoreSelectorProps {
  stores: StoreLocation[];
  productId: string;
  variantKey?: string;
  quantity?: number;
  onSelectStore?: (storeId: string) => void;
  checkAvailability?: (storeId: string) => Promise<{ available: boolean; estimatedReady?: Date | null }>;
}

export default function StoreSelector({
  stores,
  productId,
  variantKey = "",
  quantity = 1,
  onSelectStore,
  checkAvailability,
}: StoreSelectorProps) {
  const [availability, setAvailability] = useState<Record<string, { available: boolean; estimatedReady?: Date | null }>>({});

  const handleCheck = async (storeId: string) => {
    if (checkAvailability) {
      const result = await checkAvailability(storeId);
      setAvailability((prev) => ({ ...prev, [storeId]: result }));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select a store for pickup</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stores
          .filter((s) => s.services.includes("pickup"))
          .map((store) => (
            <div key={store.id}>
              <PickupOptionCard
                store={store}
                available={availability[store.id]?.available ?? false}
                estimatedReady={availability[store.id]?.estimatedReady}
                onSelect={onSelectStore}
              />
              {!availability[store.id] && checkAvailability && (
                <button
                  type="button"
                  onClick={() => handleCheck(store.id)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Check availability
                </button>
              )}
            </div>
          ))}
      </div>
      {productId && variantKey !== undefined && quantity !== undefined && (
        <p className="text-xs text-gray-500">
          Product: {productId} · Variant: {variantKey || "default"} · Qty: {quantity}
        </p>
      )}
    </div>
  );
}
