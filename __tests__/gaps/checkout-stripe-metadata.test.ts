/**
 * @jest-environment node
 *
 * Gap: Checkout does not pass userId, items, shippingAddress in Stripe session metadata.
 * Issue: issues/issue3/issue3.md
 * ~2.5h: Add metadata to session in app/api/checkout/stripe/route.ts; webhook already reads it.
 */
import { NextRequest } from "next/server";

jest.mock("@/lib/stripe/server", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({ id: "sess_1", url: "https://checkout.stripe.com/x" }),
      },
    },
  },
}));

jest.mock("@/lib/firebase/products", () => ({
  getProductById: jest.fn(),
}));

// Imports after mocks
import { POST } from "@/app/api/checkout/stripe/route";
import { stripe } from "@/lib/stripe/server";
import { getProductById } from "@/lib/firebase/products";

const mockCreate = stripe.checkout.sessions.create as jest.Mock;
const mockGetProduct = getProductById as jest.Mock;

const mockProduct = {
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
};

const mockCartItem = {
  product: mockProduct,
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
    mockGetProduct.mockResolvedValue(mockProduct);
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
});
