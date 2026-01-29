/**
 * Gap: No app/stores/page.tsx; /stores 404 or redirect loop.
 * Issue: issues/issue5/issue5.md
 * ~2.5h: Add app/stores/page.tsx (list or redirect to /stores/locate).
 */
import * as fs from "fs";
import * as path from "path";

const projectRoot = path.resolve(__dirname, "../..");

describe("Gap: Stores index page", () => {
  it("app/stores/page.tsx exists so /stores resolves", () => {
    const storesPage = path.join(projectRoot, "app", "stores", "page.tsx");
    expect(fs.existsSync(storesPage)).toBe(true);
  });
});
