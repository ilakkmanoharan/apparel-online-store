import { formatCurrency } from "@/lib/utils/formatCurrency";
describe("formatCurrency", () => {
  it("formats USD", () => {
    expect(formatCurrency(10.5)).toContain("10.50");
  });
});
