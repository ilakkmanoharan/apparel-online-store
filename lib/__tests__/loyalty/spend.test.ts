import {
  getTierBySpend,
  getNextTierSpend,
  isFreeShippingEligible,
  isPlatinum,
} from "@/lib/loyalty/spend";

describe("loyalty spend", () => {
  it("returns bronze for zero spend", () => {
    const tier = getTierBySpend(0);
    expect(tier.id).toBe("bronze");
  });

  it("returns silver at 500 spend", () => {
    const tier = getTierBySpend(500);
    expect(tier.id).toBe("silver");
  });

  it("returns platinum at 5000 spend", () => {
    const tier = getTierBySpend(5000);
    expect(tier.id).toBe("platinum");
  });

  it("getNextTierSpend returns next tier and spend needed", () => {
    const next = getNextTierSpend(0);
    expect(next).not.toBeNull();
    expect(next?.tier.id).toBe("silver");
    expect(next?.spendNeeded).toBe(500);
  });

  it("getNextTierSpend returns null at max tier", () => {
    const next = getNextTierSpend(10000);
    expect(next).toBeNull();
  });

  it("isFreeShippingEligible is false for bronze", () => {
    expect(isFreeShippingEligible("bronze")).toBe(false);
  });

  it("isFreeShippingEligible is true for platinum", () => {
    expect(isFreeShippingEligible("platinum")).toBe(true);
  });

  it("isPlatinum returns true only for platinum", () => {
    expect(isPlatinum("platinum")).toBe(true);
    expect(isPlatinum("gold")).toBe(false);
  });
});
