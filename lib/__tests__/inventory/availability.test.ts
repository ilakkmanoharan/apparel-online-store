import { getProductAvailability, isLowStock } from "@/lib/inventory/availability";

jest.mock("@/lib/firebase/products", () => ({
  getProductById: jest.fn().mockResolvedValue({
    id: "p1",
    sizes: ["S", "M", "L"],
    inStock: true,
    stockCount: 10,
  }),
}));

describe("inventory availability", () => {
  it("isLowStock returns true when quantity at or below threshold", () => {
    expect(isLowStock(3, 5)).toBe(true);
    expect(isLowStock(5, 5)).toBe(true);
  });

  it("isLowStock returns false when quantity above threshold or zero", () => {
    expect(isLowStock(6, 5)).toBe(false);
    expect(isLowStock(0, 5)).toBe(false);
  });

  it("getProductAvailability returns availability for product", async () => {
    const result = await getProductAvailability("p1");
    expect(result).not.toBeNull();
    expect(result?.productId).toBe("p1");
    expect(result?.inStock).toBe(true);
    expect(result?.totalQuantity).toBe(10);
    expect(result?.bySize).toHaveLength(3);
  });
});
