import { getTopProducts, getOrderStatsByDay } from "@/lib/admin/analytics";

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn().mockResolvedValue({ docs: [] }),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
}));

describe("admin analytics", () => {
  it("getTopProducts returns array", async () => {
    const result = await getTopProducts(5);
    expect(Array.isArray(result)).toBe(true);
  });

  it("getOrderStatsByDay returns array", async () => {
    const result = await getOrderStatsByDay(7);
    expect(Array.isArray(result)).toBe(true);
  });
});
