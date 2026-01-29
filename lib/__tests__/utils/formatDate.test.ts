import { formatDate } from "@/lib/utils/formatDate";
describe("formatDate", () => {
  it("formats", () => {
    expect(formatDate(new Date("2025-01-01"))).toBeDefined();
  });
});
