/**
 * @jest-environment node
 */

/**
 * Tests for checkout rate limiting (Phase 20).
 * Verifies that excessive requests are blocked with 429 status.
 */

import { NextRequest } from "next/server";

const mockCreate = jest.fn();
jest.mock("@/lib/stripe/server", () => ({
  stripe: {
    checkout: { sessions: { create: (...args: unknown[]) => mockCreate(...args) } },
  },
}));

const mockGetProductById = jest.fn();
jest.mock("@/lib/firebase/products", () => ({
  getProductById: (...args: unknown[]) => mockGetProductById(...args),
}));

jest.mock("@/lib/firebase/config", () => ({ db: {} }));

// Import rate limit utilities for testing
import {
  clearRateLimitStores,
  checkRateLimit,
  getClientIp,
  getRateLimitStoreSizes,
} from "@/lib/checkout/rateLimit";

// Import idempotency cache to clear between tests
import { clearCache } from "@/lib/checkout/idempotency";

import { POST } from "@/app/api/checkout/stripe/route";

const mockCartItem = {
  product: {
    id: "p1",
    name: "Test Product",
    price: 29.99,
    images: [],
    category: "women",
    sizes: ["S"],
    colors: ["Red"],
    inStock: true,
    stockCount: 10,
    description: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  quantity: 1,
  selectedSize: "S",
  selectedColor: "Red",
};

describe("Checkout rate limiting (Phase 20)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    mockCreate.mockClear();
    mockCreate.mockResolvedValue({
      id: "sess_123",
      url: "https://checkout.stripe.com/test",
    });
    mockGetProductById.mockClear();
    mockGetProductById.mockResolvedValue(mockCartItem.product);
    clearRateLimitStores();
    clearCache();
    // Set low limits for testing
    process.env = {
      ...originalEnv,
      CHECKOUT_RATE_LIMIT_IP_MAX: "3",
      CHECKOUT_RATE_LIMIT_USER_MAX: "2",
      CHECKOUT_RATE_LIMIT_WINDOW_MS: "60000",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("IP-based rate limiting", () => {
    it("allows requests under the limit", async () => {
      const body = { items: [mockCartItem] };

      // Make 3 requests (at limit)
      for (let i = 0; i < 3; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.168.1.1",
          },
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
      }

      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it("blocks requests over the limit with 429", async () => {
      const body = { items: [mockCartItem] };

      // Make 3 requests (at limit)
      for (let i = 0; i < 3; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.168.1.2",
          },
        });
        await POST(req);
      }

      // 4th request should be blocked
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "192.168.1.2",
        },
      });
      const res = await POST(req);

      expect(res.status).toBe(429);
      const data = await res.json();
      expect(data.error).toContain("Too many checkout attempts");
      expect(res.headers.get("Retry-After")).toBeTruthy();
      expect(res.headers.get("X-RateLimit-Remaining")).toBe("0");
    });

    it("different IPs have separate limits", async () => {
      const body = { items: [mockCartItem] };

      // Max out IP 1
      for (let i = 0; i < 3; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "10.0.0.1",
          },
        });
        await POST(req);
      }

      // IP 2 should still work
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "10.0.0.2",
        },
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe("User-based rate limiting", () => {
    it("applies stricter limit for authenticated users", async () => {
      const body = {
        items: [mockCartItem],
        userId: "user_123",
      };

      // Make 2 requests (at user limit)
      for (let i = 0; i < 2; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.168.1.3",
          },
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
      }

      // 3rd request should be blocked by user limit (even though IP limit is 3)
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "192.168.1.3",
        },
      });
      const res = await POST(req);
      expect(res.status).toBe(429);
    });

    it("does not apply user limit for guest checkout", async () => {
      const body = { items: [mockCartItem] }; // No userId = guest

      // Make 3 requests (IP limit)
      for (let i = 0; i < 3; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.168.1.4",
          },
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
      }

      // All 3 should succeed (guest doesn't have stricter user limit)
      expect(mockCreate).toHaveBeenCalledTimes(3);
    });

    it("different users have separate limits", async () => {
      // Max out user 1
      for (let i = 0; i < 2; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify({ items: [mockCartItem], userId: "user_a" }),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.168.1.5",
          },
        });
        await POST(req);
      }

      // User 2 should still work (same IP but different user)
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify({ items: [mockCartItem], userId: "user_b" }),
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "192.168.1.5",
        },
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    });
  });

  describe("429 response format", () => {
    it("includes Retry-After header", async () => {
      const body = { items: [mockCartItem] };

      // Exhaust limit
      for (let i = 0; i < 3; i++) {
        const req = new NextRequest("http://localhost/api/checkout/stripe", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            "X-Forwarded-For": "192.168.1.6",
          },
        });
        await POST(req);
      }

      // Get 429 response
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": "192.168.1.6",
        },
      });
      const res = await POST(req);

      expect(res.status).toBe(429);
      const retryAfter = res.headers.get("Retry-After");
      expect(retryAfter).toBeTruthy();
      expect(parseInt(retryAfter!, 10)).toBeGreaterThan(0);
      expect(parseInt(retryAfter!, 10)).toBeLessThanOrEqual(60);
    });
  });
});

describe("Rate limit module", () => {
  beforeEach(() => {
    clearRateLimitStores();
  });

  describe("getClientIp", () => {
    it("extracts IP from x-forwarded-for header", () => {
      const headers = new Headers({
        "x-forwarded-for": "203.0.113.195, 70.41.3.18, 150.172.238.178",
      });
      expect(getClientIp(headers)).toBe("203.0.113.195");
    });

    it("extracts IP from x-real-ip header", () => {
      const headers = new Headers({
        "x-real-ip": "203.0.113.100",
      });
      expect(getClientIp(headers)).toBe("203.0.113.100");
    });

    it("prefers x-forwarded-for over x-real-ip", () => {
      const headers = new Headers({
        "x-forwarded-for": "10.0.0.1",
        "x-real-ip": "10.0.0.2",
      });
      expect(getClientIp(headers)).toBe("10.0.0.1");
    });

    it("returns fallback for local development", () => {
      const headers = new Headers({});
      expect(getClientIp(headers)).toBe("127.0.0.1");
    });
  });

  describe("checkRateLimit", () => {
    it("returns not limited for first request", () => {
      const result = checkRateLimit("new-ip");
      expect(result.isLimited).toBe(false);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it("tracks requests in store", () => {
      expect(getRateLimitStoreSizes().ip).toBe(0);

      checkRateLimit("tracked-ip");
      expect(getRateLimitStoreSizes().ip).toBe(1);

      checkRateLimit("another-ip");
      expect(getRateLimitStoreSizes().ip).toBe(2);
    });

    it("tracks user requests separately", () => {
      expect(getRateLimitStoreSizes().user).toBe(0);

      checkRateLimit("ip-1", "user-1");
      expect(getRateLimitStoreSizes().user).toBe(1);

      checkRateLimit("ip-2", "user-2");
      expect(getRateLimitStoreSizes().user).toBe(2);
    });

    it("does not track guest users in user store", () => {
      checkRateLimit("ip-1", "guest");
      expect(getRateLimitStoreSizes().user).toBe(0);

      checkRateLimit("ip-2", null);
      expect(getRateLimitStoreSizes().user).toBe(0);
    });
  });

  describe("clearRateLimitStores", () => {
    it("clears all stores", () => {
      checkRateLimit("ip-1", "user-1");
      checkRateLimit("ip-2", "user-2");

      clearRateLimitStores();

      expect(getRateLimitStoreSizes().ip).toBe(0);
      expect(getRateLimitStoreSizes().user).toBe(0);
    });
  });
});
