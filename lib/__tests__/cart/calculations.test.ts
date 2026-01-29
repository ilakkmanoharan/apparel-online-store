import { calculateSubtotal, calculateDiscount, estimateShipping, calculateCartTotals } from "@/lib/cart/calculations";
import type { CartItem } from "@/types";

const mockItem = (price: number, qty: number): CartItem => ({
  product: {
    id: "1",
    name: "Test",
    description: "",
    price,
    images: [],
    category: "test",
    sizes: [],
    colors: [],
    inStock: true,
    stockCount: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  quantity: qty,
  selectedSize: "M",
  selectedColor: "Black",
});

describe("cart calculations", () => {
  it("calculates subtotal", () => {
    const items = [mockItem(10, 2), mockItem(5, 1)];
    expect(calculateSubtotal(items)).toBe(25);
  });

  it("calculates discount", () => {
    expect(calculateDiscount(100, 10)).toBe(10);
    expect(calculateDiscount(50, 20)).toBe(10);
  });

  it("estimates shipping below threshold", () => {
    expect(estimateShipping(50, 75)).toBe(5.99);
  });

  it("estimates free shipping at or above threshold", () => {
    expect(estimateShipping(75, 75)).toBe(0);
    expect(estimateShipping(100, 75)).toBe(0);
  });

  it("calculateCartTotals returns all fields", () => {
    const items = [mockItem(20, 2)];
    const totals = calculateCartTotals(items, { discountPercent: 10, freeShippingThreshold: 75 });
    expect(totals.subtotal).toBe(40);
    expect(totals.discount).toBe(4);
    expect(totals.shippingEstimate).toBe(5.99);
    expect(totals.taxEstimate).toBeDefined();
    expect(totals.total).toBeDefined();
  });
});
