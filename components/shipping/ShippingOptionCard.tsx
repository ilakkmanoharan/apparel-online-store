"use client";

import type { ShippingOption } from "@/types/shipping";
import { formatPrice } from "@/lib/utils";

interface ShippingOptionCardProps {
  option: ShippingOption;
  selected?: boolean;
  onSelect: () => void;
  estimate?: string;
}

export default function ShippingOptionCard({ option, selected, onSelect, estimate }: ShippingOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
        selected ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-gray-900">{option.name}</p>
          {option.description && <p className="text-sm text-gray-500">{option.description}</p>}
          {estimate && <p className="text-sm text-gray-600 mt-1">Est. delivery: {estimate}</p>}
        </div>
        <p className="font-semibold text-gray-900">{option.price === 0 ? "Free" : formatPrice(option.price)}</p>
      </div>
    </button>
  );
}
