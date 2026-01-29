import type { StoreLocation } from "@/types/store";

// In-memory mock; replace with Firestore when stores collection exists
const MOCK_STORES: StoreLocation[] = [
  {
    id: "store-1",
    name: "Downtown Store",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "US",
    phone: "+1 212-555-0100",
    hours: [
      { day: "mon", open: "10:00", close: "20:00" },
      { day: "tue", open: "10:00", close: "20:00" },
      { day: "wed", open: "10:00", close: "20:00" },
      { day: "thu", open: "10:00", close: "20:00" },
      { day: "fri", open: "10:00", close: "21:00" },
      { day: "sat", open: "09:00", close: "21:00" },
      { day: "sun", open: "11:00", close: "18:00" },
    ],
    latitude: 40.7128,
    longitude: -74.006,
    services: ["pickup", "returns", "gift_cards"],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getStores(activeOnly = true): Promise<StoreLocation[]> {
  return MOCK_STORES.filter((s) => !activeOnly || s.active);
}

export async function getStoreById(id: string): Promise<StoreLocation | null> {
  return MOCK_STORES.find((s) => s.id === id) ?? null;
}

export async function searchStores(
  _query: string,
  _filters?: { city?: string; state?: string; services?: string[] }
): Promise<StoreLocation[]> {
  return getStores();
}
