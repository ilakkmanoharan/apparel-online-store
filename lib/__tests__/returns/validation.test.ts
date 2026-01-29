import {
  validateReturnEligibility,
  validateReturnItems,
  isValidReturnReason,
} from "@/lib/returns/validation";
import type { ReturnItem } from "@/types/returns";

describe("returns validation", () => {
  it("rejects returns outside the eligible window", () => {
    const thirtyFiveDaysAgo = new Date(Date.now() - 35 * 24 * 60 * 60 * 1000);
    const result = validateReturnEligibility(thirtyFiveDaysAgo, 1);
    expect(result.eligible).toBe(false);
    expect(result.message).toMatch(/within 30 days/i);
  });

  it("rejects empty item lists", () => {
    const result = validateReturnItems([]);
    expect(result.valid).toBe(false);
    expect(result.message).toMatch(/No items selected/i);
  });

  it("accepts valid items and reasons", () => {
    const items: ReturnItem[] = [
      {
        orderId: "order1",
        productId: "prod1",
        variantKey: "M-Black",
        quantity: 1,
        reason: "wrong_size",
      },
    ];
    const result = validateReturnItems(items);
    expect(result.valid).toBe(true);
  });

  it("validates allowed reasons", () => {
    expect(isValidReturnReason("wrong_size")).toBe(true);
    expect(isValidReturnReason("invalid_reason" as any)).toBe(false);
  });
});

