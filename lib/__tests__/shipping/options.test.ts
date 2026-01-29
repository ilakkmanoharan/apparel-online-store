import { getShippingOptions, getDeliveryEstimate } from "@/lib/shipping/options";

describe("getShippingOptions", () => {
  it("returns options with ids", () => {
    const options = getShippingOptions(50);
    expect(options.length).toBeGreaterThan(0);
    options.forEach((opt) => {
      expect(opt.id).toBeDefined();
      expect(opt.name).toBeDefined();
      expect(opt.price).toBeGreaterThanOrEqual(0);
    });
  });

  it("applies free standard shipping when subtotal >= 75", () => {
    const options = getShippingOptions(75);
    const standard = options.find((o) => o.type === "standard");
    expect(standard).toBeDefined();
    expect(standard?.price).toBe(0);
  });

  it("charges for standard when subtotal < 75", () => {
    const options = getShippingOptions(50);
    const standard = options.find((o) => o.type === "standard");
    expect(standard).toBeDefined();
    expect(standard?.price).toBeDefined();
  });
});

describe("getDeliveryEstimate", () => {
  it("returns formatted date range", () => {
    const estimate = getDeliveryEstimate({ minDays: 5, maxDays: 7 });
    expect(estimate.minDate).toBeInstanceOf(Date);
    expect(estimate.maxDate).toBeInstanceOf(Date);
    expect(estimate.formatted).toMatch(/[A-Za-z]{3}\s+\d+/);
  });

  it("returns single date when minDays === maxDays", () => {
    const estimate = getDeliveryEstimate({ minDays: 2, maxDays: 2 });
    expect(estimate.formatted).not.toContain("–");
  });
});
