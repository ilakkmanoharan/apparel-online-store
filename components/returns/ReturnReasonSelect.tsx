"use client";

import type { ReturnReason } from "@/types/returns";

const REASON_LABELS: Record<ReturnReason, string> = {
  wrong_size: "Wrong size",
  wrong_item: "Wrong item received",
  defective: "Defective or damaged",
  not_as_described: "Not as described",
  changed_mind: "Changed my mind",
  other: "Other",
};

interface ReturnReasonSelectProps {
  value: ReturnReason | "";
  onChange: (value: ReturnReason) => void;
  id?: string;
}

export default function ReturnReasonSelect({ value, onChange, id }: ReturnReasonSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as ReturnReason)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
    >
      <option value="">Select a reason</option>
      {(Object.keys(REASON_LABELS) as ReturnReason[]).map((reason) => (
        <option key={reason} value={reason}>
          {REASON_LABELS[reason]}
        </option>
      ))}
    </select>
  );
}
