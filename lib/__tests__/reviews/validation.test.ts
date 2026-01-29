import { validateReview } from "@/lib/reviews/validation";

describe("validateReview", () => {
  it("accepts valid rating 1-5", () => {
    expect(validateReview({ rating: 3 }).valid).toBe(true);
  });
  it("rejects rating < 1 or > 5", () => {
    expect(validateReview({ rating: 0 }).valid).toBe(false);
    expect(validateReview({ rating: 6 }).valid).toBe(false);
  });
});