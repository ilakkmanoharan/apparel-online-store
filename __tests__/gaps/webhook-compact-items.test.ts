/**
 * Test: Webhook expands compact cart items from metadata.
 * Issue: issues/issue3/issue3.md (Phase 6)
 * Verifies that webhook correctly parses compact items and fetches product details.
 * @jest-environment node
 */
import type Stripe from "stripe";

const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn().mockResolvedValue(undefined);

jest.mock("@/lib/firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: () => ({}),
  doc: () => ({}),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDocs: jest.fn(),
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({}),
}));

const mockGetProductById = jest.fn();
jest.mock("@/lib/firebase/products", () => ({
  getProductById: (...args: unknown[]) => mockGetProductById(...args),
}));

// Suppress console.warn for placeholder product tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});
afterAll(() => {
  console.warn = originalWarn;
});

import { handleStripeWebhookEvent } from "@/lib/firebase/orders";

const mockProduct = {
  id: "p1",
  name: "Test Product",
  description: "A test product",
  price: 29.99,
  images: ["https://example.com/img.jpg"],
  category: "women",
  sizes: ["S", "M", "L"],
  colors: ["Red", "Blue"],
  inStock: true,
  stockCount: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function createCheckoutEvent(
  itemsMetadata: string,
  userId = "user_1"
): Stripe.Event {
  return {
    id: "evt_1",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123",
        metadata: {
          userId,
          items: itemsMetadata,
          shippingAddress: JSON.stringify({
            id: "a1",
            fullName: "Jane Doe",
            street: "123 Main St",
            city: "Boston",
            state: "MA",
            zipCode: "02101",
            country: "US",
          }),
        },
        amount_total: 2999,
        payment_status: "paid",
        customer: "cus_1",
      } as Stripe.Checkout.Session,
    },
  } as Stripe.Event;
}

describe("Webhook compact items expansion", () => {
  beforeEach(() => {
    mockGetDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetProductById.mockClear();
    mockGetDoc.mockResolvedValue({ exists: () => false });
  });

  it("expands compact items by fetching product details", async () => {
    mockGetProductById.mockResolvedValue(mockProduct);

    const compactItems = [
      {
        productId: "p1",
        quantity: 2,
        selectedSize: "M",
        selectedColor: "Red",
        price: 29.99,
      },
    ];
    const event = createCheckoutEvent(JSON.stringify(compactItems));

    await handleStripeWebhookEvent(event);

    expect(mockGetProductById).toHaveBeenCalledWith("p1");
    expect(mockSetDoc).toHaveBeenCalled();

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.items).toHaveLength(1);
    expect(savedData.items[0].product.id).toBe("p1");
    expect(savedData.items[0].product.name).toBe("Test Product");
    expect(savedData.items[0].product.price).toBe(29.99); // Checkout-time price
    expect(savedData.items[0].quantity).toBe(2);
    expect(savedData.items[0].selectedSize).toBe("M");
    expect(savedData.items[0].selectedColor).toBe("Red");
  });

  it("uses checkout-time price even if product price changed", async () => {
    // Product price in DB is different from checkout time
    const productWithNewPrice = { ...mockProduct, price: 39.99 };
    mockGetProductById.mockResolvedValue(productWithNewPrice);

    const compactItems = [
      {
        productId: "p1",
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Blue",
        price: 29.99, // Price at checkout time
      },
    ];
    const event = createCheckoutEvent(JSON.stringify(compactItems));

    await handleStripeWebhookEvent(event);

    const savedData = mockSetDoc.mock.calls[0][1];
    // Should use the checkout-time price, not the current DB price
    expect(savedData.items[0].product.price).toBe(29.99);
  });

  it("creates placeholder product when product not found", async () => {
    mockGetProductById.mockResolvedValue(null);

    const compactItems = [
      {
        productId: "deleted_product",
        quantity: 1,
        selectedSize: "L",
        selectedColor: "Green",
        price: 49.99,
      },
    ];
    const event = createCheckoutEvent(JSON.stringify(compactItems));

    await handleStripeWebhookEvent(event);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("Product not found: deleted_product")
    );

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.items).toHaveLength(1);
    expect(savedData.items[0].product.id).toBe("deleted_product");
    expect(savedData.items[0].product.name).toContain("[Deleted Product]");
    expect(savedData.items[0].product.price).toBe(49.99);
    expect(savedData.items[0].quantity).toBe(1);
  });

  it("handles multiple items with mixed product availability", async () => {
    mockGetProductById
      .mockResolvedValueOnce(mockProduct) // First product found
      .mockResolvedValueOnce(null); // Second product not found

    const compactItems = [
      {
        productId: "p1",
        quantity: 1,
        selectedSize: "S",
        selectedColor: "Red",
        price: 29.99,
      },
      {
        productId: "p2_deleted",
        quantity: 2,
        selectedSize: "M",
        selectedColor: "Blue",
        price: 19.99,
      },
    ];
    const event = createCheckoutEvent(JSON.stringify(compactItems));

    await handleStripeWebhookEvent(event);

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.items).toHaveLength(2);

    // First item - found product
    expect(savedData.items[0].product.name).toBe("Test Product");

    // Second item - placeholder
    expect(savedData.items[1].product.name).toContain("[Deleted Product]");
    expect(savedData.items[1].product.price).toBe(19.99);
  });
});

describe("Webhook missing metadata handling", () => {
  beforeEach(() => {
    mockGetDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetProductById.mockClear();
    mockGetDoc.mockResolvedValue({ exists: () => false });
  });

  it("logs warning when metadata is missing userId", async () => {
    const event: Stripe.Event = {
      id: "evt_1",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_missing_userid",
          metadata: {
            items: JSON.stringify([]),
            // userId is missing
          },
          amount_total: 1000,
          payment_status: "paid",
          customer: "cus_1",
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("missing metadata"),
      "cs_missing_userid"
    );
  });

  it("logs warning when metadata is missing items", async () => {
    const event: Stripe.Event = {
      id: "evt_1",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_missing_items",
          metadata: {
            userId: "user_1",
            // items is missing
          },
          amount_total: 1000,
          payment_status: "paid",
          customer: "cus_1",
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("missing metadata"),
      "cs_missing_items"
    );
  });

  it("uses guest userId when metadata.userId is missing", async () => {
    const event: Stripe.Event = {
      id: "evt_1",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_no_userid",
          metadata: {
            items: JSON.stringify([]),
          },
          amount_total: 1000,
          payment_status: "paid",
          customer: "cus_1",
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.userId).toBe("guest");
  });
});

describe("Webhook malformed metadata handling", () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    mockGetDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetProductById.mockClear();
    mockGetDoc.mockResolvedValue({ exists: () => false });
    (console.error as jest.Mock).mockClear();
  });

  it("sets status to needs_review when items JSON is malformed", async () => {
    const event: Stripe.Event = {
      id: "evt_1",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_malformed_items",
          metadata: {
            userId: "user_1",
            items: "not valid json {{{",
          },
          amount_total: 2999,
          payment_status: "paid",
          customer: "cus_1",
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse metadata.items"),
      "cs_malformed_items",
      expect.any(Error)
    );

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.status).toBe("needs_review");
    expect(savedData.metadataParseError).toBe(true);
    expect(savedData.items).toEqual([]);
  });

  it("sets status to needs_review when shippingAddress JSON is malformed", async () => {
    mockGetProductById.mockResolvedValue(mockProduct);

    const compactItems = [
      { productId: "p1", quantity: 1, selectedSize: "S", selectedColor: "Red", price: 29.99 },
    ];

    const event: Stripe.Event = {
      id: "evt_1",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_malformed_address",
          metadata: {
            userId: "user_1",
            items: JSON.stringify(compactItems),
            shippingAddress: "invalid json <<<",
          },
          amount_total: 2999,
          payment_status: "paid",
          customer: "cus_1",
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse metadata.shippingAddress"),
      "cs_malformed_address",
      expect.any(Error)
    );

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.status).toBe("needs_review");
    expect(savedData.metadataParseError).toBe(true);
    expect(savedData.shippingAddress).toBeNull();
  });

  it("sets status to processing when metadata is valid", async () => {
    mockGetProductById.mockResolvedValue(mockProduct);

    const compactItems = [
      { productId: "p1", quantity: 1, selectedSize: "S", selectedColor: "Red", price: 29.99 },
    ];

    const event = createCheckoutEvent(JSON.stringify(compactItems));

    await handleStripeWebhookEvent(event);

    const savedData = mockSetDoc.mock.calls[0][1];
    expect(savedData.status).toBe("processing");
    expect(savedData.metadataParseError).toBeUndefined();
  });
});
