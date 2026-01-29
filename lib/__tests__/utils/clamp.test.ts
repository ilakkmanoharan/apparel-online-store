import { clamp } from "@/lib/utils/clamp";
describe("clamp", () => {
  it("clamps value", () => {
    expect(clamp(10, 0, 5)).toBe(5);
  });
});
