import { slugify } from "@/lib/utils/slugify";
describe("slugify", () => {
  it("lowercases and replaces spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
});
