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

// Mock getProductById - by default returns the product from the cart item
const mockGetProductById = jest.fn();
jest.mock("@/lib/firebase/products", () => ({
  getProductById: (...args: unknown[]) => mockGetProductById(...args),
}));

// Mock Firebase config to avoid initialization
jest.mock("@/lib/firebase/config", () => ({ db: {} }));

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
    // Default: product exists in DB
    mockGetProductById.mockClear();
    mockGetProductById.mockResolvedValue(mockCartItem.product);
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

  it("returns 400 when successUrl is not same-origin", async () => {
    const body = {
      items: [mockCartItem],
      successUrl: "https://evil.com/steal-session",
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid successUrl: must be same-origin");
  });

  it("returns 400 when cancelUrl is not same-origin", async () => {
    const body = {
      items: [mockCartItem],
      cancelUrl: "https://evil.com/redirect",
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid cancelUrl: must be same-origin");
  });

  it("allows same-origin successUrl and cancelUrl", async () => {
    const body = {
      items: [mockCartItem],
      successUrl: "http://localhost:3000/custom-success?id={CHECKOUT_SESSION_ID}",
      cancelUrl: "http://localhost:3000/custom-cancel",
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "http://localhost:3000/custom-success?id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/custom-cancel",
      })
    );
  });

  it("allows relative path URLs", async () => {
    const body = {
      items: [mockCartItem],
      successUrl: "/my-success-page",
      cancelUrl: "/my-cancel-page",
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "/my-success-page",
        cancel_url: "/my-cancel-page",
      })
    );
  });

  it("returns 400 when product does not exist in database", async () => {
    mockGetProductById.mockResolvedValue(null);

    const body = {
      items: [mockCartItem],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Product not found: p1");
  });

  it("validates all products in cart exist", async () => {
    // First product exists, second doesn't
    mockGetProductById
      .mockResolvedValueOnce(mockCartItem.product)
      .mockResolvedValueOnce(null);

    const body = {
      items: [
        mockCartItem,
        {
          ...mockCartItem,
          product: { ...mockCartItem.product, id: "nonexistent_product" },
        },
      ],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Product not found: nonexistent_product");
  });

  it("returns 400 when product is out of stock", async () => {
    mockGetProductById.mockResolvedValue({
      ...mockCartItem.product,
      inStock: false,
      stockCount: 0,
    });

    const body = {
      items: [mockCartItem],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Insufficient stock for product p1");
    expect(data.error).toContain("requested 1");
    expect(data.error).toContain("available 0");
  });

  it("returns 400 when requested quantity exceeds stock", async () => {
    mockGetProductById.mockResolvedValue({
      ...mockCartItem.product,
      inStock: true,
      stockCount: 5,
    });

    const body = {
      items: [{ ...mockCartItem, quantity: 10 }],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe(
      "Insufficient stock for product p1: requested 10, available 5"
    );
  });

  it("allows checkout when stock is sufficient", async () => {
    mockGetProductById.mockResolvedValue({
      ...mockCartItem.product,
      inStock: true,
      stockCount: 10,
    });

    const body = {
      items: [{ ...mockCartItem, quantity: 5 }],
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    await POST(req);

    expect(mockCreate).toHaveBeenCalled();
  });

  it("returns 400 when client price does not match server price", async () => {
    // Server has different price than client submitted
    mockGetProductById.mockResolvedValue({
      ...mockCartItem.product,
      price: 39.99, // Server price is different
    });

    const body = {
      items: [mockCartItem], // mockCartItem has price: 29.99
    };
    const req = new NextRequest("http://localhost/api/checkout/stripe", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Price mismatch for product p1: expected 39.99, got 29.99");
  });

  it("uses server price for Stripe line items", async () => {
    const serverPrice = 29.99;
    mockGetProductById.mockResolvedValue({
      ...mockCartItem.product,
      price: serverPrice,
    });

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
    expect(callArgs.line_items[0].price_data.unit_amount).toBe(
      Math.round(serverPrice * 100)
    );
  });

  it("uses server price in compact items metadata", async () => {
    const serverPrice = 29.99;
    mockGetProductById.mockResolvedValue({
      ...mockCartItem.product,
      price: serverPrice,
    });

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
    expect(parsedItems[0].price).toBe(serverPrice);
  });
});
