"use client";

import type { ShippingHabit } from "@/types/userPreferences";

const HABITS: { value: ShippingHabit; label: string }[] = [
  { value: "none", label: "No preference" },
  { value: "standard", label: "Standard (5–7 days)" },
  { value: "express", label: "Express (2–3 days)" },
  { value: "frequent", label: "Frequent buyer" },
];

interface ShippingPreferenceFormProps {
  value: ShippingHabit;
  onChange: (habit: ShippingHabit) => void;
  disabled?: boolean;
}

export default function ShippingPreferenceForm({ value, onChange, disabled }: ShippingPreferenceFormProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Shipping preference</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ShippingHabit)}
        disabled={disabled}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:opacity-50"
      >
        {HABITS.map((h) => (
          <option key={h.value} value={h.value}>{h.label}</option>
        ))}
      </select>
    </div>
  );
}
