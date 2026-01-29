import { validateEmail, isValidEmail } from "@/lib/validators/email";

describe("validateEmail", () => {
  it("returns valid for correct email", () => {
    expect(validateEmail("a@b.co").valid).toBe(true);
    expect(isValidEmail("a@b.co")).toBe(true);
  });
  it("returns invalid for empty", () => {
    expect(validateEmail("").valid).toBe(false);
    expect(validateEmail("   ").valid).toBe(false);
  });
  it("returns invalid for bad format", () => {
    expect(validateEmail("notanemail").valid).toBe(false);
    expect(validateEmail("@nodomain.com").valid).toBe(false);
  });
});
