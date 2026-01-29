import type { ShippingOption, DeliveryEstimate } from "@/types/shipping";
import { DEFAULT_SHIPPING_OPTIONS, FREE_SHIPPING_THRESHOLD } from "./constants";

export function getShippingOptions(subtotal: number): ShippingOption[] {
  const options: ShippingOption[] = DEFAULT_SHIPPING_OPTIONS.map((opt, i) => ({
    ...opt,
    id: `shipping-${opt.type}-${i}`,
    price: subtotal >= FREE_SHIPPING_THRESHOLD && opt.type === "standard" ? 0 : opt.price,
  }));
  return options;
}

export function getDeliveryEstimate(
  option: Pick<ShippingOption, "minDays" | "maxDays">,
  fromDate: Date = new Date()
): DeliveryEstimate {
  const minDate = new Date(fromDate);
  minDate.setDate(minDate.getDate() + option.minDays);
  const maxDate = new Date(fromDate);
  maxDate.setDate(maxDate.getDate() + option.maxDays);
  const format = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return {
    minDate,
    maxDate,
    formatted: option.minDays === option.maxDays
      ? format(minDate)
      : `${format(minDate)} – ${format(maxDate)}`,
  };
}
