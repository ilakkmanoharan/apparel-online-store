import {
  checkPromoEligibility,
  getApplicableDiscountPercent,
} from "@/lib/promo/eligibility";

describe("promo eligibility", () => {
  it("returns eligible when no min order", () => {
    const result = checkPromoEligibility("SAVE10", 25, null);
    expect(result.eligible).toBe(true);
  });

  it("returns ineligible when subtotal below min order", () => {
    const result = checkPromoEligibility("SAVE20", 30, 50);
    expect(result.eligible).toBe(false);
    expect(result.reason).toMatch(/50/);
    expect(result.minOrder).toBe(50);
  });

  it("returns eligible when subtotal meets min order", () => {
    const result = checkPromoEligibility("SAVE20", 50, 50);
    expect(result.eligible).toBe(true);
  });

  it("getApplicableDiscountPercent returns 0 when ineligible", () => {
    const pct = getApplicableDiscountPercent("X", 10, 20, 50);
    expect(pct).toBe(0);
  });

  it("getApplicableDiscountPercent returns discount when eligible", () => {
    const pct = getApplicableDiscountPercent("X", 15, 100, null);
    expect(pct).toBe(15);
  });
});
