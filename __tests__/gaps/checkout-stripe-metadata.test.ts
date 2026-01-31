/**
 * Gap: Checkout does not pass userId, items, shippingAddress in Stripe session metadata.
 * Issue: issues/issue3/issue3.md
 * ~2.5h: Add metadata to session in app/api/checkout/stripe/route.ts; webhook already reads it.
 * @jest-environment node
 */
import { NextRequest } from "next/server";

const mockCreate = jest.fn();
jest.mock("@/lib/stripe/server", () => ({
  stripe: { checkout: { sessions: { create: (...args: unknown[]) => mockCreate(...args) } } },
}));

// Import after mock
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

const mockAddress = {
  id: "a1",
  fullName: "Jane Doe",
  street: "123 Main St",
  city: "Boston",
  state: "MA",
  zipCode: "02101",
  country: "US",
};

describe("Gap: Stripe session metadata", () => {
  beforeEach(() => {
    mockCreate.mockClear();
    mockCreate.mockResolvedValue({ id: "sess_1", url: "https://checkout.stripe.com/x" });
  });

  it("POST /api/checkout/stripe includes userId, items, shippingAddress in session metadata", async () => {
    const body = {
      items: [mockCartItem],
      userId: "user_abc",
      shippingAddress: mockAddress,
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          userId: "user_abc",
          items: expect.any(String),
          shippingAddress: expect.any(String),
        }),
      })
    );
  });

  it("returns 400 when userId is empty string", async () => {
    const body = {
      items: [mockCartItem],
      userId: "",
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid userId: must be non-empty string");
  });

  it("returns 400 when userId is whitespace-only", async () => {
    const body = {
      items: [mockCartItem],
      userId: "   ",
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid userId: must be non-empty string");
  });

  it("uses 'guest' in metadata when userId is omitted", async () => {
    const body = {
      items: [mockCartItem],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({
          userId: "guest",
        }),
      })
    );
  });

  it("uses compact items format in metadata (productId, quantity, size, color, price)", async () => {
    const body = {
      items: [mockCartItem],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    const callArgs = mockCreate.mock.calls[0][0];
    const parsedItems = JSON.parse(callArgs.metadata.items);
    expect(parsedItems).toEqual([
      {
        productId: "p1",
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Red",
        price: 29.99,
      },
    ]);
  });

  it("returns 400 when cart items exceed 500 chars", async () => {
    // Create many items to exceed the 500-char limit
    // Each item has valid sizes/colors but long product IDs
    const manyItems = Array.from({ length: 15 }, (_, i) => ({
      product: {
        ...mockCartItem.product,
        id: `product-with-a-very-long-identifier-string-number-${i}`,
        sizes: [], // Empty sizes array bypasses size validation
        colors: [], // Empty colors array bypasses color validation
      },
      quantity: 1,
      selectedSize: "Medium-Large",
      selectedColor: "Navy-Blue-Green",
    }));

    const body = { items: manyItems };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Cart too large for checkout; please reduce items");
  });

  it("returns 400 when shippingAddress exceeds 500 chars", async () => {
    const longAddress = {
      ...mockAddress,
      street: "A".repeat(400),
      city: "B".repeat(100),
    };

    const body = {
      items: [mockCartItem],
      shippingAddress: longAddress,
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Shipping address too large; please shorten field values");
  });
});
