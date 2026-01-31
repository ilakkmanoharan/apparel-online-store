/**
 * @jest-environment node
 */

/**
 * Tests for inventory restore on refund (Phase 22).
 * Verifies that inventory is restored when orders are fully refunded.
 */

import type Stripe from "stripe";
import type { CartItem, Product } from "@/types";

const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn().mockResolvedValue(undefined);
const mockGetDocs = jest.fn();
const mockUpdateDoc = jest.fn().mockResolvedValue(undefined);

jest.mock("@/lib/firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: () => ({}),
  doc: () => ({}),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({}),
}));

// Mock email to avoid side effects
jest.mock("@/lib/email/order-confirmation", () => ({
  sendOrderConfirmationEmail: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock deduct (not needed for restore tests)
jest.mock("@/lib/inventory/deduct", () => ({
  deductForOrder: jest.fn().mockResolvedValue([]),
}));

import { restoreForOrder } from "@/lib/inventory/restore";
import { handleStripeWebhookEvent } from "@/lib/firebase/orders";

const mockProduct: Product = {
  id: "p1",
  name: "Test Product",
  description: "A test product",
  price: 29.99,
  images: [],
  category: "women",
  sizes: ["S", "M", "L"],
  colors: ["Red", "Blue"],
  inStock: true,
  stockCount: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCartItem: CartItem = {
  product: mockProduct,
  quantity: 2,
  selectedSize: "M",
  selectedColor: "Red",
};

describe("restoreForOrder", () => {
  beforeEach(() => {
    mockGetDoc.mockClear();
    mockUpdateDoc.mockClear();
  });

  it("restores stock for each item in order", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stockCount: 8 }),
    });

    const items: CartItem[] = [
      { ...mockCartItem, quantity: 2 },
    ];

    const results = await restoreForOrder(items);

    expect(results).toHaveLength(1);
    expect(results[0].productId).toBe("p1");
    expect(results[0].previousStock).toBe(8);
    expect(results[0].restored).toBe(2);
    expect(results[0].newStock).toBe(10);

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stockCount: 10,
        inStock: true,
      })
    );
  });

  it("handles multiple items", async () => {
    mockGetDoc
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ stockCount: 5 }),
      })
      .mockResolvedValueOnce({
        exists: () => true,
        data: () => ({ stockCount: 3 }),
      });

    const items: CartItem[] = [
      { ...mockCartItem, product: { ...mockProduct, id: "p1" }, quantity: 2 },
      { ...mockCartItem, product: { ...mockProduct, id: "p2" }, quantity: 3 },
    ];

    const results = await restoreForOrder(items);

    expect(results).toHaveLength(2);
    expect(results[0].newStock).toBe(7); // 5 + 2
    expect(results[1].newStock).toBe(6); // 3 + 3
    expect(mockUpdateDoc).toHaveBeenCalledTimes(2);
  });

  it("skips products that no longer exist", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    mockGetDoc.mockResolvedValue({
      exists: () => false,
    });

    const items: CartItem[] = [mockCartItem];

    const results = await restoreForOrder(items);

    expect(results).toHaveLength(0);
    expect(mockUpdateDoc).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Product not found for restore: p1")
    );

    consoleSpy.mockRestore();
  });

  it("sets inStock to true when restoring to positive stock", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stockCount: 0, inStock: false }),
    });

    const items: CartItem[] = [{ ...mockCartItem, quantity: 5 }];

    await restoreForOrder(items);

    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stockCount: 5,
        inStock: true,
      })
    );
  });

  it("handles zero initial stock", async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stockCount: 0 }),
    });

    const items: CartItem[] = [{ ...mockCartItem, quantity: 3 }];

    const results = await restoreForOrder(items);

    expect(results[0].previousStock).toBe(0);
    expect(results[0].newStock).toBe(3);
  });
});

describe("Webhook inventory restore on refund", () => {
  beforeEach(() => {
    mockGetDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetDocs.mockClear();
    mockUpdateDoc.mockClear();
  });

  it("restores inventory on full refund", async () => {
    const orderItems: CartItem[] = [
      { ...mockCartItem, quantity: 2 },
    ];

    // Mock finding the order
    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: "order_full_refund",
          data: () => ({
            status: "processing",
            stripePaymentIntentId: "pi_test_full",
            items: orderItems,
          }),
        },
      ],
    });

    // Mock product for inventory restore
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ stockCount: 8 }),
    });

    const event: Stripe.Event = {
      id: "evt_refund_full",
      object: "event",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_full",
          payment_intent: "pi_test_full",
          amount: 5998,
          amount_refunded: 5998, // Full refund
          refunded: true,
        } as Stripe.Charge,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    // Should update order status
    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: "refunded",
      }),
      { merge: true }
    );

    // Should restore inventory
    expect(mockUpdateDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stockCount: 10, // 8 + 2
        inStock: true,
      })
    );
  });

  it("does not restore inventory on partial refund", async () => {
    const orderItems: CartItem[] = [
      { ...mockCartItem, quantity: 2 },
    ];

    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: "order_partial_refund",
          data: () => ({
            status: "processing",
            stripePaymentIntentId: "pi_test_partial",
            items: orderItems,
          }),
        },
      ],
    });

    const event: Stripe.Event = {
      id: "evt_refund_partial",
      object: "event",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_partial",
          payment_intent: "pi_test_partial",
          amount: 5998,
          amount_refunded: 2999, // Partial refund
          refunded: false,
        } as Stripe.Charge,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    // Should update order status to partially_refunded
    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: "partially_refunded",
      }),
      { merge: true }
    );

    // Should NOT call updateDoc for inventory (partial refund)
    expect(mockUpdateDoc).not.toHaveBeenCalled();
  });

  it("marks order for review when inventory restore fails", async () => {
    const orderItems: CartItem[] = [
      { ...mockCartItem, quantity: 2 },
    ];

    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: "order_restore_fail",
          data: () => ({
            status: "processing",
            stripePaymentIntentId: "pi_test_fail",
            items: orderItems,
          }),
        },
      ],
    });

    // Make inventory restore fail
    mockGetDoc.mockRejectedValue(new Error("Firestore error"));

    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const event: Stripe.Event = {
      id: "evt_refund_fail",
      object: "event",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_fail",
          payment_intent: "pi_test_fail",
          amount: 5998,
          amount_refunded: 5998,
          refunded: true,
        } as Stripe.Charge,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    // Should mark order with inventoryRestoreError
    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        inventoryRestoreError: true,
      }),
      { merge: true }
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to restore inventory"),
      "order_restore_fail",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("handles order with no items gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

    mockGetDocs.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: "order_no_items",
          data: () => ({
            status: "processing",
            stripePaymentIntentId: "pi_no_items",
            items: [], // Empty items
          }),
        },
      ],
    });

    const event: Stripe.Event = {
      id: "evt_no_items",
      object: "event",
      type: "charge.refunded",
      data: {
        object: {
          id: "ch_no_items",
          payment_intent: "pi_no_items",
          amount: 1000,
          amount_refunded: 1000,
          refunded: true,
        } as Stripe.Charge,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("no items to restore"),
      "order_no_items"
    );

    consoleSpy.mockRestore();
  });
});
