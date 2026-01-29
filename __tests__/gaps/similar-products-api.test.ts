/**
 * Gap: No lib/recommendations/similarProducts.ts or GET /api/products/[id]/similar.
 * Issue: issues/issue7/issue7.md
 * ~2.5h: Add similarProducts lib and app/api/products/[id]/similar/route.ts.
 */
import * as fs from "fs";
import * as path from "path";

const projectRoot = path.resolve(__dirname, "../..");

describe("Gap: Similar products API and lib", () => {
  it("lib/recommendations/similarProducts.ts exists", () => {
    const libPath = path.join(projectRoot, "lib", "recommendations", "similarProducts.ts");
    expect(fs.existsSync(libPath)).toBe(true);
  });

  it("app/api/products/[id]/similar/route.ts exists", () => {
    const routePath = path.join(projectRoot, "app", "api", "products", "[id]", "similar", "route.ts");
    expect(fs.existsSync(routePath)).toBe(true);
  });
});
