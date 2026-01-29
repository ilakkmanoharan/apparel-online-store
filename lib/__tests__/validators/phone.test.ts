import { validatePhone } from "@/lib/validators/phone";

describe("validatePhone", () => {
  it("returns valid for 10 digits", () => {
    const r = validatePhone("5551234567");
    expect(r.valid).toBe(true);
  });
  it("returns invalid for too short", () => {
    expect(validatePhone("123").valid).toBe(false);
  });
});
