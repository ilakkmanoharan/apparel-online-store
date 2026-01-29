import { validateShippingAddress, validatePaymentMethod } from "@/lib/checkout/validation";

describe("checkout validation", () => {
  it("rejects null address", () => {
    const result = validateShippingAddress(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("accepts valid address", () => {
    const result = validateShippingAddress({
      id: "1",
      fullName: "Jane Doe",
      street: "123 Main St",
      city: "NYC",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isDefault: false,
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects empty fullName", () => {
    const result = validateShippingAddress({
      id: "1",
      fullName: "",
      street: "123 Main",
      city: "NYC",
      state: "NY",
      zipCode: "10001",
      country: "USA",
      isDefault: false,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.toLowerCase().includes("name"))).toBe(true);
  });

  it("validatePaymentMethod rejects empty", () => {
    expect(validatePaymentMethod(null).valid).toBe(false);
    expect(validatePaymentMethod("").valid).toBe(false);
  });

  it("validatePaymentMethod accepts non-empty", () => {
    expect(validatePaymentMethod("pm_xxx").valid).toBe(true);
  });
});
