/**
 * @jest-environment node
 */

/**
 * Tests for webhook refund and dispute handling (Phase 21).
 * Verifies that charge.refunded and charge.dispute.created events
 * correctly update order status in Firestore.
 */

import type Stripe from "stripe";

const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn().mockResolvedValue(undefined);
const mockGetDocs = jest.fn();

jest.mock("@/lib/firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: () => ({}),
  doc: () => ({}),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({}),
}));

const mockGetProductById = jest.fn();
jest.mock("@/lib/firebase/products", () => ({
  getProductById: (...args: unknown[]) => mockGetProductById(...args),
}));

// Mock email to avoid side effects
jest.mock("@/lib/email/order-confirmation", () => ({
  sendOrderConfirmationEmail: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock inventory deduction
jest.mock("@/lib/inventory/deduct", () => ({
  deductForOrder: jest.fn().mockResolvedValue([]),
}));

import { handleStripeWebhookEvent } from "@/lib/firebase/orders";

describe("Webhook refund handling (Phase 21)", () => {
  beforeEach(() => {
    mockGetDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetDocs.mockClear();
  });

  describe("charge.refunded", () => {
    it("updates order status to refunded for full refund", async () => {
      // Mock finding the order
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [
          {
            id: "order_123",
            data: () => ({
              status: "processing",
              stripePaymentIntentId: "pi_test_123",
            }),
          },
        ],
      });

      const event: Stripe.Event = {
        id: "evt_refund_1",
        object: "event",
        type: "charge.refunded",
        data: {
          object: {
            id: "ch_test_123",
            payment_intent: "pi_test_123",
            amount: 2999,
            amount_refunded: 2999,
            refunded: true,
          } as Stripe.Charge,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "refunded",
          paymentStatus: "refunded",
          refundedAmount: 29.99,
          refundedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
        { merge: true }
      );
    });

    it("updates order status to partially_refunded for partial refund", async () => {
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [
          {
            id: "order_456",
            data: () => ({
              status: "processing",
              stripePaymentIntentId: "pi_test_456",
            }),
          },
        ],
      });

      const event: Stripe.Event = {
        id: "evt_refund_2",
        object: "event",
        type: "charge.refunded",
        data: {
          object: {
            id: "ch_test_456",
            payment_intent: "pi_test_456",
            amount: 5000,
            amount_refunded: 2000, // Partial refund
            refunded: false,
          } as Stripe.Charge,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "partially_refunded",
          paymentStatus: "partially_refunded",
          refundedAmount: 20.0,
        }),
        { merge: true }
      );
    });

    it("logs warning when order not found for refund", async () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: [],
      });

      const event: Stripe.Event = {
        id: "evt_refund_3",
        object: "event",
        type: "charge.refunded",
        data: {
          object: {
            id: "ch_unknown",
            payment_intent: "pi_unknown",
            amount: 1000,
            amount_refunded: 1000,
            refunded: true,
          } as Stripe.Charge,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("No order found"),
        "pi_unknown"
      );
      expect(mockSetDoc).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("logs warning when payment_intent is missing", async () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const event: Stripe.Event = {
        id: "evt_refund_4",
        object: "event",
        type: "charge.refunded",
        data: {
          object: {
            id: "ch_no_pi",
            payment_intent: null,
            amount: 1000,
            amount_refunded: 1000,
            refunded: true,
          } as unknown as Stripe.Charge,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing payment_intent"),
        "ch_no_pi"
      );
      expect(mockSetDoc).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe("charge.dispute.created", () => {
    it("updates order status to disputed", async () => {
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [
          {
            id: "order_789",
            data: () => ({
              status: "processing",
              stripePaymentIntentId: "pi_test_789",
            }),
          },
        ],
      });

      const event: Stripe.Event = {
        id: "evt_dispute_1",
        object: "event",
        type: "charge.dispute.created",
        data: {
          object: {
            id: "dp_test_123",
            charge: "ch_test_789",
            payment_intent: "pi_test_789",
            amount: 2999,
            reason: "fraudulent",
          } as Stripe.Dispute,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "disputed",
          disputeId: "dp_test_123",
          disputeReason: "fraudulent",
          disputeAmount: 29.99,
          disputedAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
        { merge: true }
      );
    });

    it("logs warning when order not found for dispute", async () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      mockGetDocs.mockResolvedValue({
        empty: true,
        docs: [],
      });

      const event: Stripe.Event = {
        id: "evt_dispute_2",
        object: "event",
        type: "charge.dispute.created",
        data: {
          object: {
            id: "dp_unknown",
            charge: "ch_unknown",
            payment_intent: "pi_unknown",
            amount: 1000,
            reason: "product_not_received",
          } as Stripe.Dispute,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("No order found"),
        "pi_unknown"
      );
      expect(mockSetDoc).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("logs warning when payment_intent is missing from dispute", async () => {
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const event: Stripe.Event = {
        id: "evt_dispute_3",
        object: "event",
        type: "charge.dispute.created",
        data: {
          object: {
            id: "dp_no_pi",
            charge: "ch_no_pi",
            payment_intent: null,
            amount: 1000,
            reason: "general",
          } as unknown as Stripe.Dispute,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("missing payment_intent"),
        "dp_no_pi"
      );
      expect(mockSetDoc).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it("stores dispute reason on order", async () => {
      mockGetDocs.mockResolvedValue({
        empty: false,
        docs: [
          {
            id: "order_dispute_reason",
            data: () => ({
              status: "processing",
              stripePaymentIntentId: "pi_reason_test",
            }),
          },
        ],
      });

      const event: Stripe.Event = {
        id: "evt_dispute_4",
        object: "event",
        type: "charge.dispute.created",
        data: {
          object: {
            id: "dp_reason",
            charge: "ch_reason",
            payment_intent: "pi_reason_test",
            amount: 5000,
            reason: "product_unacceptable",
          } as Stripe.Dispute,
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(mockSetDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          disputeReason: "product_unacceptable",
        }),
        { merge: true }
      );
    });
  });

  describe("unhandled events", () => {
    it("logs unhandled event types", async () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      const event: Stripe.Event = {
        id: "evt_unknown",
        object: "event",
        type: "payment_intent.created" as any,
        data: {
          object: {},
        },
      } as Stripe.Event;

      await handleStripeWebhookEvent(event);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining("Unhandled webhook event type"),
      );

      consoleSpy.mockRestore();
    });
  });
});

describe("Order payment intent storage", () => {
  beforeEach(() => {
    mockGetDoc.mockClear();
    mockSetDoc.mockClear();
    mockGetDocs.mockClear();
    mockGetProductById.mockClear();
  });

  it("stores stripePaymentIntentId on order creation", async () => {
    mockGetDoc.mockResolvedValue({ exists: () => false });
    mockGetProductById.mockResolvedValue({
      id: "p1",
      name: "Test",
      price: 29.99,
    });

    const event: Stripe.Event = {
      id: "evt_checkout_1",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_with_pi",
          payment_intent: "pi_stored_123",
          metadata: {
            userId: "user_1",
            items: JSON.stringify([
              { productId: "p1", quantity: 1, selectedSize: "M", selectedColor: "Red", price: 29.99 },
            ]),
          },
          amount_total: 2999,
          payment_status: "paid",
          customer: "cus_1",
        } as Stripe.Checkout.Session,
      },
    } as Stripe.Event;

    await handleStripeWebhookEvent(event);

    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        stripePaymentIntentId: "pi_stored_123",
      }),
      { merge: true }
    );
  });
});
