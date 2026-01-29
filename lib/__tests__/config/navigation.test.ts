import { mainNavItems } from "@/lib/config/navigation";

describe("navigation", () => {
  it("exports mainNavItems as array", () => {
    expect(Array.isArray(mainNavItems)).toBe(true);
  });
  it("has Women and Men", () => {
    const labels = mainNavItems.map((n) => n.label);
    expect(labels).toContain("Women");
    expect(labels).toContain("Men");
  });
});
