"use client";

import type { DeliveryEstimate as DeliveryEstimateType } from "@/types/shipping";

interface DeliveryEstimateProps {
  estimate: DeliveryEstimateType;
  className?: string;
}

export default function DeliveryEstimate({ estimate, className = "" }: DeliveryEstimateProps) {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      Estimated delivery: {estimate.formatted}
    </p>
  );
}
