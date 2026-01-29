"use client";

import type { PaymentMethod } from "@/types/payment";

interface SavedCardsProps {
  methods: PaymentMethod[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function SavedCards({ methods, selectedId, onSelect, onRemove }: SavedCardsProps) {
  if (methods.length === 0) return null;
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Saved cards</h3>
      <ul className="space-y-2">
        {methods.map((m) => (
          <li key={m.id} className="flex items-center justify-between border rounded px-3 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="savedCard"
                checked={selectedId === m.id}
                onChange={() => onSelect?.(m.id)}
              />
              <span className="text-sm">{m.brand ?? "Card"} ****{m.last4 ?? "****"}</span>
            </label>
            {onRemove && (
              <button type="button" onClick={() => onRemove(m.id)} className="text-xs text-red-600 hover:underline">
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
