import { renderHook } from "@testing-library/react";
import { useCheckoutSteps } from "@/hooks/useCheckoutSteps";

describe("useCheckoutSteps", () => {
  it("returns step and goNext", () => {
    const { result } = renderHook(() => useCheckoutSteps());
    expect(result.current.currentStep).toBeDefined();
    expect(typeof result.current.goNext).toBe("function");
  });
});
