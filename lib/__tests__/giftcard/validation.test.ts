import { validateGiftCardCode, validateGiftCardAmount } from "@/lib/giftcard/validation";

describe("giftcard validation", () => {
  it("validates code length", () => {
    expect(validateGiftCardCode("SHORT").valid).toBe(false);
    expect(validateGiftCardCode("XXXXXXXXXX").valid).toBe(true);
  });
  it("validates amount range", () => {
    expect(validateGiftCardAmount(4).valid).toBe(false);
    expect(validateGiftCardAmount(501).valid).toBe(false);
    expect(validateGiftCardAmount(50).valid).toBe(true);
  });
});