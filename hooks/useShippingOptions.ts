import { useMemo } from "react";
import { getShippingOptions, getDeliveryEstimate } from "@/lib/shipping/options";
import type { ShippingOption } from "@/types/shipping";

export function useShippingOptions(subtotal: number): ShippingOption[] {
  return useMemo(() => getShippingOptions(subtotal), [subtotal]);
}

export function useDeliveryEstimate(
  option: Pick<ShippingOption, "minDays" | "maxDays"> | null,
  fromDate?: Date
) {
  return useMemo(() => {
    if (!option) return null;
    return getDeliveryEstimate(option, fromDate);
  }, [option?.minDays, option?.maxDays, fromDate?.getTime()]);
}
