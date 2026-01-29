"use client";

import type { StoreHours as StoreHoursType } from "@/types/store";

const DAY_LABELS: Record<string, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

interface StoreHoursProps {
  hours: StoreHoursType[];
  className?: string;
}

export default function StoreHours({ hours, className = "" }: StoreHoursProps) {
  if (!hours?.length) return null;
  return (
    <div className={className}>
      <h3 className="font-semibold text-sm mb-2">Store hours</h3>
      <ul className="text-sm text-gray-600 space-y-1">
        {hours.map((h, i) => (
          <li key={i}>
            {DAY_LABELS[h.day] ?? h.day}:{" "}
            {h.closed ? "Closed" : `${h.open} – ${h.close}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
