import { usePromoStore } from "@/store/promoStore";

describe("promoStore", () => {
  beforeEach(() => {
    usePromoStore.getState().clearPromo();
  });

  it("starts with no promo", () => {
    const { code, discountPercent } = usePromoStore.getState();
    expect(code).toBeNull();
    expect(discountPercent).toBe(0);
  });

  it("setPromo updates code and percent", () => {
    const { setPromo, code, discountPercent } = usePromoStore.getState();
    setPromo("SAVE10", 10);
    expect(usePromoStore.getState().code).toBe("SAVE10");
    expect(usePromoStore.getState().discountPercent).toBe(10);
  });

  it("applyDiscount reduces subtotal by percent", () => {
    const { setPromo, applyDiscount } = usePromoStore.getState();
    setPromo("SAVE10", 10);
    expect(applyDiscount(100)).toBe(90);
    expect(applyDiscount(50)).toBe(45);
  });

  it("applyDiscount returns full when no promo", () => {
    const { applyDiscount } = usePromoStore.getState();
    expect(applyDiscount(100)).toBe(100);
  });

  it("clearPromo resets", () => {
    const { setPromo, clearPromo } = usePromoStore.getState();
    setPromo("SAVE10", 10);
    clearPromo();
    expect(usePromoStore.getState().code).toBeNull();
    expect(usePromoStore.getState().discountPercent).toBe(0);
  });
});
