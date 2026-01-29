"use client";

import type { ReturnRequest } from "@/types/returns";

interface ReturnTimelineProps {
  request: ReturnRequest;
}

const STEPS: { id: ReturnRequest["status"]; label: string }[] = [
  { id: "requested", label: "Requested" },
  { id: "approved", label: "Approved" },
  { id: "label_sent", label: "Label sent" },
  { id: "in_transit", label: "In transit" },
  { id: "received", label: "Received" },
  { id: "refunded", label: "Refunded" },
];

export default function ReturnTimeline({ request }: ReturnTimelineProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === request.status);

  return (
    <ol className="flex items-center gap-2 text-xs text-gray-500">
      {STEPS.map((step, index) => {
        const isPast = currentIndex > index;
        const isCurrent = currentIndex === index;

        return (
          <li key={step.id} className="flex items-center gap-1">
            <span
              className={[
                "inline-flex h-1.5 w-1.5 rounded-full",
                isPast ? "bg-emerald-500" : isCurrent ? "bg-gray-900" : "bg-gray-300",
              ].join(" ")}
            />
            <span>{step.label}</span>
            {index < STEPS.length - 1 && <span className="mx-1 h-px w-4 bg-gray-200" />}
          </li>
        );
      })}
    </ol>
  );
}

