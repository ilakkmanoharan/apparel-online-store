import { parseNumber } from "@/lib/utils/parseNumber";
describe("parseNumber", () => {
  it("parses", () => {
    expect(parseNumber("42")).toBe(42);
  });
});
