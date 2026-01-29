import { validateQuestion } from "@/lib/qa/validation";

describe("qa validation", () => {
  it("rejects empty question", () => {
    const result = validateQuestion("");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  it("rejects too short question", () => {
    const result = validateQuestion("Short");
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/10/);
  });

  it("accepts valid question", () => {
    const result = validateQuestion("Does this run true to size?");
    expect(result.valid).toBe(true);
  });

  it("rejects question over 500 characters", () => {
    const long = "a".repeat(501);
    const result = validateQuestion(long);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/500/);
  });
});
