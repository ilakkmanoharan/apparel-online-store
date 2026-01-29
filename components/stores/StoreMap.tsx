"use client";

import { useMemo } from "react";
import type { StoreLocation } from "@/types/store";

interface StoreMapProps {
  stores: StoreLocation[];
  selectedStoreId?: string | null;
  onSelectStore?: (storeId: string) => void;
  className?: string;
}

export default function StoreMap({
  stores,
  selectedStoreId,
  onSelectStore,
  className = "",
}: StoreMapProps) {
  const hasCoords = useMemo(
    () => stores.some((s) => s.latitude != null && s.longitude != null),
    [stores]
  );

  if (!hasCoords) {
    return (
      <div
        className={"bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 min-h-[200px] " + className}
        aria-label="Store map placeholder"
      >
        <span>Map (add API key for Google Maps or Mapbox)</span>
      </div>
    );
  }

  return (
    <div
      className={"bg-gray-100 rounded-lg min-h-[200px] flex items-center justify-center " + className}
      aria-label="Store map"
    >
      <div className="text-center text-gray-600 text-sm">
        <p>{stores.filter((s) => s.latitude != null).length} stores with coordinates</p>
        {selectedStoreId && (
          <p className="mt-1">Selected: {stores.find((s) => s.id === selectedStoreId)?.name ?? selectedStoreId}</p>
        )}
        {onSelectStore && (
          <div className="mt-2 flex flex-wrap gap-2 justify-center">
            {stores.slice(0, 5).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectStore(s.id)}
                className="px-2 py-1 bg-white border rounded text-xs hover:bg-gray-50"
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
