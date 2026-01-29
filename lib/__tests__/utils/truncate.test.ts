import { truncate } from "@/lib/utils/truncate";
describe("truncate", () => {
  it("truncates long strings", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });
});
