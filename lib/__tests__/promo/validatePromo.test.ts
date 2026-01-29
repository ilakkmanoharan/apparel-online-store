import { validatePromoCode } from "@/lib/promo/validatePromo";

describe("validatePromoCode", () => {
  it("returns valid for SAVE10 with any subtotal", () => {
    const result = validatePromoCode("SAVE10", 10);
    expect(result.valid).toBe(true);
    expect(result.discountPercent).toBe(10);
  });

  it("returns valid for SAVE20 when subtotal >= 50", () => {
    const result = validatePromoCode("SAVE20", 50);
    expect(result.valid).toBe(true);
    expect(result.discountPercent).toBe(20);
  });

  it("returns invalid for SAVE20 when subtotal < 50", () => {
    const result = validatePromoCode("SAVE20", 49);
    expect(result.valid).toBe(false);
    expect(result.message).toContain("Minimum order");
  });

  it("returns invalid for unknown code", () => {
    const result = validatePromoCode("INVALID", 100);
    expect(result.valid).toBe(false);
    expect(result.message).toContain("Invalid");
  });

  it("trims and uppercases code", () => {
    const result = validatePromoCode("  save10  ", 10);
    expect(result.valid).toBe(true);
    expect(result.discountPercent).toBe(10);
  });

  it("returns message for empty code", () => {
    const result = validatePromoCode("", 10);
    expect(result.valid).toBe(false);
    expect(result.message).toBeDefined();
  });
});
