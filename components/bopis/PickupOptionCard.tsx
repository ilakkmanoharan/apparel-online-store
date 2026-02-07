"use client";

import LocaleLink from "@/components/common/LocaleLink";
import type { StoreLocation } from "@/types/store";

interface PickupOptionCardProps {
  store: StoreLocation;
  available: boolean;
  estimatedReady?: Date | null;
  onSelect?: (storeId: string) => void;
}

export default function PickupOptionCard({
  store,
  available,
  estimatedReady,
  onSelect,
}: PickupOptionCardProps) {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="font-semibold">{store.name}</h3>
      <p className="text-sm text-gray-600">
        {store.address}, {store.city}, {store.state} {store.zipCode}
      </p>
      {store.phone && <p className="text-sm text-gray-600">Phone: {store.phone}</p>}
      <div className="mt-auto flex items-center justify-between">
        <span className={available ? "text-green-600 text-sm" : "text-red-600 text-sm"}>
          {available ? "Available for pickup" : "Not available"}
        </span>
        {estimatedReady && (
          <span className="text-xs text-gray-500">
            Ready by {new Date(estimatedReady).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="flex gap-2 mt-2">
        <LocaleLink href={`/stores/${store.id}`} className="text-sm text-blue-600 hover:underline">
          Store details
        </LocaleLink>
        {available && onSelect && (
          <button
            type="button"
            onClick={() => onSelect(store.id)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            Select store
          </button>
        )}
      </div>
    </div>
  );
}
