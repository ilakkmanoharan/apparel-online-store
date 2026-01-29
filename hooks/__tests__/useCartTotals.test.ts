import { renderHook } from "@testing-library/react";
import { useCartTotals } from "@/hooks/useCartTotals";

describe("useCartTotals", () => {
  it("returns subtotal and total", () => {
    const { result } = renderHook(() => useCartTotals());
    expect(typeof result.current.subtotal).toBe("number");
    expect(typeof result.current.total).toBe("number");
  });
});
