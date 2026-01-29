"use client";

import type { Address } from "@/types";
import { cn } from "@/lib/utils";

interface SavedAddressSelectProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (address: Address) => void;
  onAddNew?: () => void;
  className?: string;
}

function formatAddressLine(a: Address): string {
  const parts = [a.street, a.city, a.state, a.zipCode, a.country].filter(Boolean);
  return parts.join(", ");
}

export default function SavedAddressSelect({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  className,
}: SavedAddressSelectProps) {
  if (addresses.length === 0 && !onAddNew) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">Shipping address</label>
      <div className="space-y-2">
        {addresses.map((addr) => (
          <label
            key={addr.id}
            className={cn(
              "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
              selectedId === addr.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
            )}
          >
            <input
              type="radio"
              name="savedAddress"
              value={addr.id}
              checked={selectedId === addr.id}
              onChange={() => onSelect(addr)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{addr.fullName}</p>
              <p className="text-sm text-gray-600 mt-0.5">{formatAddressLine(addr)}</p>
              {addr.isDefault && (
                <span className="inline-block mt-1 text-xs text-gray-500">Default</span>
              )}
            </div>
          </label>
        ))}
        {onAddNew && (
          <button
            type="button"
            onClick={onAddNew}
            className="w-full p-4 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 text-sm font-medium"
          >
            + Add new address
          </button>
        )}
      </div>
    </div>
  );
}
