import { checkStoreAvailability } from "@/lib/bopis/availability";

jest.mock("@/lib/stores/locations", () => ({
  getStoreById: jest.fn((id: string) => {
    if (id === "store-1")
      return Promise.resolve({
        id: "store-1",
        name: "Downtown",
        services: ["pickup", "returns"],
      });
    if (id === "store-no-pickup")
      return Promise.resolve({
        id: "store-no-pickup",
        name: "No Pickup",
        services: ["returns"],
      });
    return Promise.resolve(null);
  }),
}));

describe("bopis availability", () => {
  it("returns available when store has pickup", async () => {
    const result = await checkStoreAvailability("store-1", "prod-1", "M", 1);
    expect(result.available).toBe(true);
  });

  it("returns not available when store does not offer pickup", async () => {
    const result = await checkStoreAvailability("store-no-pickup", "prod-1", "M", 1);
    expect(result.available).toBe(false);
    expect(result.message).toContain("pickup");
  });

  it("returns not available when store not found", async () => {
    const result = await checkStoreAvailability("missing", "prod-1", "M", 1);
    expect(result.available).toBe(false);
    expect(result.message).toContain("not found");
  });
});
