import { cn, formatPrice, calculateDiscount } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", true && "block")).toBe("base block");
  });
});

describe("formatPrice", () => {
  it("formats number as USD", () => {
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice(19.99)).toBe("$19.99");
    expect(formatPrice(100)).toBe("$100.00");
  });
});

describe("calculateDiscount", () => {
  it("calculates discount percentage", () => {
    expect(calculateDiscount(100, 80)).toBe(20);
    expect(calculateDiscount(50, 25)).toBe(50);
  });

  it("returns 0 when no discount", () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });
});
