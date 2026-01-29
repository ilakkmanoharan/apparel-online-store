import { validatePassword, isStrongPassword } from "@/lib/validators/password";

describe("password validator", () => {
  it("rejects empty password", () => {
    expect(validatePassword("")).toEqual({
      valid: false,
      message: "Password is required.",
    });
  });

  it("rejects too-short password", () => {
    const result = validatePassword("Ab1!");
    expect(result.valid).toBe(false);
  });

  it("accepts strong password", () => {
    const result = validatePassword("StrongPass1!");
    expect(result.valid).toBe(true);
    expect(isStrongPassword("StrongPass1!")).toBe(true);
  });
});

