/**
 * @jest-environment node
 */

/**
 * Tests for Orders API (Phase 23).
 * Verifies GET /api/orders returns orders correctly.
 */

import { NextRequest } from "next/server";

const mockGetOrderByStripeSessionId = jest.fn();
const mockGetOrdersForUser = jest.fn();

jest.mock("@/lib/firebase/orders", () => ({
  getOrderByStripeSessionId: (...args: unknown[]) =>
    mockGetOrderByStripeSessionId(...args),
  getOrdersForUser: (...args: unknown[]) => mockGetOrdersForUser(...args),
}));

jest.mock("@/lib/firebase/config", () => ({ db: {} }));

import { GET } from "@/app/api/orders/route";

const mockOrder = {
  id: "cs_test_123",
  userId: "user_1",
  items: [
    {
      product: {
        id: "p1",
        name: "Test Product",
        price: 29.99,
        images: ["https://example.com/img.jpg"],
      },
      quantity: 2,
      selectedSize: "M",
      selectedColor: "Red",
    },
  ],
  total: 59.98,
  shippingAddress: {
    fullName: "Jane Doe",
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    zipCode: "02101",
    country: "US",
  },
  status: "processing",
  paymentStatus: "paid",
  createdAt: new Date("2026-01-15"),
  updatedAt: new Date("2026-01-15"),
};

describe("Orders API (Phase 23)", () => {
  beforeEach(() => {
    mockGetOrderByStripeSessionId.mockClear();
    mockGetOrdersForUser.mockClear();
  });

  describe("GET with session_id", () => {
    it("returns order when found", async () => {
      mockGetOrderByStripeSessionId.mockResolvedValue(mockOrder);

      const req = new NextRequest(
        "http://localhost/api/orders?session_id=cs_test_123"
      );
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.order).toBeDefined();
      expect(data.order.id).toBe("cs_test_123");
      expect(data.order.items).toHaveLength(1);
      expect(data.order.shippingAddress.fullName).toBe("Jane Doe");
      expect(mockGetOrderByStripeSessionId).toHaveBeenCalledWith("cs_test_123");
    });

    it("returns 404 when order not found", async () => {
      mockGetOrderByStripeSessionId.mockResolvedValue(null);

      const req = new NextRequest(
        "http://localhost/api/orders?session_id=cs_nonexistent"
      );
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(404);
      expect(data.error).toBe("Order not found");
    });
  });

  describe("GET with userId", () => {
    it("returns orders for user", async () => {
      const orders = [mockOrder, { ...mockOrder, id: "cs_test_456" }];
      mockGetOrdersForUser.mockResolvedValue(orders);

      const req = new NextRequest(
        "http://localhost/api/orders?userId=user_1"
      );
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.orders).toHaveLength(2);
      expect(mockGetOrdersForUser).toHaveBeenCalledWith("user_1");
    });

    it("returns empty array when user has no orders", async () => {
      mockGetOrdersForUser.mockResolvedValue([]);

      const req = new NextRequest(
        "http://localhost/api/orders?userId=user_no_orders"
      );
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.orders).toEqual([]);
    });
  });

  describe("GET without params", () => {
    it("returns 400 when neither session_id nor userId provided", async () => {
      const req = new NextRequest("http://localhost/api/orders");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe("Either session_id or userId is required");
    });
  });

  describe("session_id takes precedence", () => {
    it("uses session_id when both params provided", async () => {
      mockGetOrderByStripeSessionId.mockResolvedValue(mockOrder);

      const req = new NextRequest(
        "http://localhost/api/orders?session_id=cs_test_123&userId=user_1"
      );
      const res = await GET(req);

      expect(res.status).toBe(200);
      expect(mockGetOrderByStripeSessionId).toHaveBeenCalledWith("cs_test_123");
      expect(mockGetOrdersForUser).not.toHaveBeenCalled();
    });
  });

  describe("error handling", () => {
    it("returns 500 on database error", async () => {
      mockGetOrderByStripeSessionId.mockRejectedValue(
        new Error("Database error")
      );

      const req = new NextRequest(
        "http://localhost/api/orders?session_id=cs_error"
      );
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.error).toBe("Failed to fetch orders");
    });
  });
});

describe("getOrderByStripeSessionId", () => {
  it("order ID matches session ID", async () => {
    mockGetOrderByStripeSessionId.mockResolvedValue({
      ...mockOrder,
      id: "cs_session_abc123",
    });

    const req = new NextRequest(
      "http://localhost/api/orders?session_id=cs_session_abc123"
    );
    const res = await GET(req);
    const data = await res.json();

    expect(data.order.id).toBe("cs_session_abc123");
  });
});
