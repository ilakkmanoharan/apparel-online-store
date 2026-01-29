import { getTierForPoints } from "@/lib/loyalty/tiers";

describe("getTierForPoints", () => {
  it("returns bronze for 0 points", () => {
    expect(getTierForPoints(0).id).toBe("bronze");
  });
  it("returns silver for 500 points", () => {
    expect(getTierForPoints(500).id).toBe("silver");
  });
});