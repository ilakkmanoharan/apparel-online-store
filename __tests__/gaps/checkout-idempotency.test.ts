/**
 * @jest-environment node
 */

/**
 * Tests for checkout idempotency (Phase 19).
 * Verifies that duplicate requests with the same idempotency key
 * return cached sessions instead of creating new ones.
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

// Import the idempotency cache for testing
import {
  clearCache,
  getCacheSize,
  getCachedSession,
  setCachedSession,
} from "@/lib/checkout/idempotency";

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

describe("Checkout idempotency (Phase 19)", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockCreate.mockResolvedValue({
      id: "sess_new_123",
      url: "https://checkout.stripe.com/new",
    });
    mockGetProductById.mockClear();
    mockGetProductById.mockResolvedValue(mockCartItem.product);
    clearCache();
  });

  describe("idempotency key from header", () => {
    it("creates new session when no idempotency key is provided", async () => {
      const body = { items: [mockCartItem] };
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      const res = await POST(req);
      const data = await res.json();

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(data.id).toBe("sess_new_123");
      expect(data.url).toBe("https://checkout.stripe.com/new");
      expect(data.cached).toBeUndefined();
    });

    it("creates new session on first request with idempotency key", async () => {
      const body = { items: [mockCartItem] };
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "unique-key-123",
        },
      });

      const res = await POST(req);
      const data = await res.json();

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(data.id).toBe("sess_new_123");
      expect(data.cached).toBeUndefined();
    });

    it("returns cached session on duplicate request with same key", async () => {
      const body = { items: [mockCartItem] };

      // First request
      const req1 = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "duplicate-key-456",
        },
      });
      await POST(req1);

      // Second request with same key
      const req2 = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "duplicate-key-456",
        },
      });
      const res2 = await POST(req2);
      const data2 = await res2.json();

      // Should only call Stripe once
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(data2.id).toBe("sess_new_123");
      expect(data2.cached).toBe(true);
    });

    it("creates new session for different idempotency keys", async () => {
      const body = { items: [mockCartItem] };

      // First request
      const req1 = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "key-a",
        },
      });
      await POST(req1);

      // Second request with different key
      mockCreate.mockResolvedValue({
        id: "sess_different_456",
        url: "https://checkout.stripe.com/different",
      });

      const req2 = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "key-b",
        },
      });
      const res2 = await POST(req2);
      const data2 = await res2.json();

      // Should call Stripe twice (different keys)
      expect(mockCreate).toHaveBeenCalledTimes(2);
      expect(data2.id).toBe("sess_different_456");
      expect(data2.cached).toBeUndefined();
    });
  });

  describe("idempotency key from body", () => {
    it("accepts idempotency key from request body", async () => {
      const body = {
        items: [mockCartItem],
        idempotencyKey: "body-key-123",
      };
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      await POST(req);

      // Verify session is cached
      const cached = getCachedSession("body-key-123");
      expect(cached).not.toBeNull();
      expect(cached?.sessionId).toBe("sess_new_123");
    });

    it("returns cached session for duplicate body key", async () => {
      // First request
      const body1 = {
        items: [mockCartItem],
        idempotencyKey: "body-dup-key",
      };
      const req1 = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body1),
        headers: { "Content-Type": "application/json" },
      });
      await POST(req1);

      // Second request
      const body2 = {
        items: [mockCartItem],
        idempotencyKey: "body-dup-key",
      };
      const req2 = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body2),
        headers: { "Content-Type": "application/json" },
      });
      const res2 = await POST(req2);
      const data2 = await res2.json();

      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(data2.cached).toBe(true);
    });

    it("header takes precedence over body key", async () => {
      // Pre-cache a session for the header key
      setCachedSession("header-key", "cached-sess", "https://cached.url");

      const body = {
        items: [mockCartItem],
        idempotencyKey: "body-key", // Different from header
      };
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": "header-key", // Should use this
        },
      });

      const res = await POST(req);
      const data = await res.json();

      // Should return cached session for header key
      expect(data.id).toBe("cached-sess");
      expect(data.cached).toBe(true);
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("cache management", () => {
    it("stores session in cache after creation", async () => {
      expect(getCacheSize()).toBe(0);

      const body = {
        items: [mockCartItem],
        idempotencyKey: "store-test-key",
      };
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      await POST(req);

      expect(getCacheSize()).toBe(1);
      const cached = getCachedSession("store-test-key");
      expect(cached).not.toBeNull();
      expect(cached?.sessionId).toBe("sess_new_123");
      expect(cached?.url).toBe("https://checkout.stripe.com/new");
    });

    it("does not cache when no idempotency key provided", async () => {
      expect(getCacheSize()).toBe(0);

      const body = { items: [mockCartItem] };
      const req = new NextRequest("http://localhost/api/checkout/stripe", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });

      await POST(req);

      expect(getCacheSize()).toBe(0);
    });
  });
});

describe("Idempotency cache module", () => {
  beforeEach(() => {
    clearCache();
  });

  it("getCachedSession returns null for non-existent key", () => {
    expect(getCachedSession("nonexistent")).toBeNull();
  });

  it("setCachedSession and getCachedSession round-trip", () => {
    setCachedSession("test-key", "sess-123", "https://example.com");

    const cached = getCachedSession("test-key");
    expect(cached).not.toBeNull();
    expect(cached?.sessionId).toBe("sess-123");
    expect(cached?.url).toBe("https://example.com");
    expect(cached?.createdAt).toBeLessThanOrEqual(Date.now());
  });

  it("clearCache removes all entries", () => {
    setCachedSession("key1", "sess1", "url1");
    setCachedSession("key2", "sess2", "url2");
    expect(getCacheSize()).toBe(2);

    clearCache();
    expect(getCacheSize()).toBe(0);
  });

  it("handles null URL", () => {
    setCachedSession("null-url-key", "sess-456", null);

    const cached = getCachedSession("null-url-key");
    expect(cached?.url).toBeNull();
  });

  it("returns null for expired entries", () => {
    // Set a very short TTL for testing
    const originalEnv = process.env.CHECKOUT_IDEMPOTENCY_TTL_MS;
    process.env.CHECKOUT_IDEMPOTENCY_TTL_MS = "1"; // 1ms TTL

    setCachedSession("expire-key", "sess-old", "https://old.url");

    // Wait for expiration
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const cached = getCachedSession("expire-key");
        expect(cached).toBeNull();

        // Restore original env
        if (originalEnv) {
          process.env.CHECKOUT_IDEMPOTENCY_TTL_MS = originalEnv;
        } else {
          delete process.env.CHECKOUT_IDEMPOTENCY_TTL_MS;
        }
        resolve();
      }, 10);
    });
  });
});
