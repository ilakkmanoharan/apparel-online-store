/**
 * Gap: Footer links /contact, /shipping, /returns, /faq, /about, /careers, /sustainability, /press 404.
 * Issue: issues/issue8/issue8.md
 * ~2.5h: Add minimal pages or redirects for all footer-linked routes.
 */
import * as fs from "fs";
import * as path from "path";

const projectRoot = path.resolve(__dirname, "../..");
const FOOTER_ROUTES = [
  "contact",
  "shipping",
  "returns",
  "faq",
  "about",
  "careers",
  "sustainability",
  "press",
];

function pageExists(segment: string): boolean {
  const inApp = path.join(projectRoot, "app", segment, "page.tsx");
  const inStatic = path.join(projectRoot, "app", "(static)", segment, "page.tsx");
  return fs.existsSync(inApp) || fs.existsSync(inStatic);
}

describe("Gap: Footer static pages", () => {
  FOOTER_ROUTES.forEach((segment) => {
    it(`${segment} has a page (app/${segment}/page.tsx or app/(static)/${segment}/page.tsx)`, () => {
      expect(pageExists(segment)).toBe(true);
    });
  });
});
