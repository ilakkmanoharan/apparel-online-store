"use client";

import { useState } from "react";

interface StoreFiltersProps {
  cities: string[];
  states: string[];
  onFilter?: (filters: { city?: string; state?: string; pickupOnly?: boolean }) => void;
  className?: string;
}

export default function StoreFilters({
  cities,
  states,
  onFilter,
  className = "",
}: StoreFiltersProps) {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pickupOnly, setPickupOnly] = useState(false);

  const handleApply = () => {
    onFilter?.({ city: city || undefined, state: state || undefined, pickupOnly });
  };

  return (
    <div className={"space-y-3 " + className}>
      <h3 className="font-semibold text-sm">Filter stores</h3>
      {cities.length > 0 && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded px-2 py-1.5 text-sm"
          >
            <option value="">All cities</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}
      {states.length > 0 && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border rounded px-2 py-1.5 text-sm"
          >
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pickupOnly} onChange={(e) => setPickupOnly(e.target.checked)} />
        Pickup only
      </label>
      <button
        type="button"
        onClick={handleApply}
        className="w-full py-2 bg-gray-800 text-white text-sm font-medium rounded hover:bg-gray-700"
      >
        Apply
      </button>
    </div>
  );
}
