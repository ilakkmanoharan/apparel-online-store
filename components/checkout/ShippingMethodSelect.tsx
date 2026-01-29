"use client";

import { cn } from "@/lib/utils";

export interface ShippingOption {
  id: string;
  label: string;
  description?: string;
  price: number;
  estimatedDays?: string;
}

interface ShippingMethodSelectProps {
  options: ShippingOption[];
  value: string | null;
  onChange: (id: string) => void;
  className?: string;
}

export default function ShippingMethodSelect({
  options,
  value,
  onChange,
  className,
}: ShippingMethodSelectProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">Shipping method</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={cn(
              "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
              value === opt.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-300"
            )}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={opt.id}
              checked={value === opt.id}
              onChange={() => onChange(opt.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{opt.label}</p>
              {opt.description && (
                <p className="text-sm text-gray-500 mt-0.5">{opt.description}</p>
              )}
              {opt.estimatedDays && (
                <p className="text-xs text-gray-500 mt-0.5">{opt.estimatedDays}</p>
              )}
            </div>
            <span className="font-medium text-gray-900">
              {opt.price === 0 ? "Free" : `$${opt.price.toFixed(2)}`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
