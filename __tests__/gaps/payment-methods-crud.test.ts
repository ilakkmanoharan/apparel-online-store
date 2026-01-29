/**
 * Gap: Only payment-methods/list exists; no POST to add or DELETE to remove a payment method.
 * Issue: issues/issue10/issue10.md
 * ~2.5h: Add POST /api/payment-methods and DELETE /api/payment-methods/[id].
 */
import * as fs from "fs";
import * as path from "path";

const projectRoot = path.resolve(__dirname, "../..");

describe("Gap: Payment methods add/remove API", () => {
  it("app/api/payment-methods/route.ts exists (POST add card)", () => {
    const postRoute = path.join(projectRoot, "app", "api", "payment-methods", "route.ts");
    expect(fs.existsSync(postRoute)).toBe(true);
  });

  it("app/api/payment-methods/[id]/route.ts exists (DELETE remove card)", () => {
    const deleteRoute = path.join(projectRoot, "app", "api", "payment-methods", "[id]", "route.ts");
    expect(fs.existsSync(deleteRoute)).toBe(true);
  });
});
