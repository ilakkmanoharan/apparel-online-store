"use client";

import type { ReturnRequest } from "@/types/returns";

interface RefundSummaryProps {
  request: ReturnRequest;
  currency?: string;
}

export default function RefundSummary({ request, currency = "USD" }: RefundSummaryProps) {
  const amount = request.refundAmount ?? 0;

  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Estimated refund</span>
        <span className="text-base font-semibold text-gray-900">
          {formatter.format(amount)}
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Final amount may differ if items are not received in original condition or outside
        the return window.
      </p>
    </div>
  );
}

