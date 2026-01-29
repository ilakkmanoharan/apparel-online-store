/**
 * Gap: Webhook does not decrement inventory on checkout.session.completed.
 * Issue: issues/issue4/issue4.md
 * ~2.5h: Call deductForOrder from handleStripeWebhookEvent; implement lib/inventory/deduct.ts.
 */
import type Stripe from "stripe";

const mockDeductForOrder = jest.fn().mockResolvedValue(undefined);
jest.mock("@/lib/inventory/deduct", () => ({
  deductForOrder: (...args: unknown[]) => mockDeductForOrder(...args),
}));

jest.mock("@/lib/firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => ({
  collection: () => ({}),
  doc: () => ({}),
  getDoc: jest.fn().mockResolvedValue({ exists: () => false }),
  setDoc: jest.fn().mockResolvedValue(undefined),
  getDocs: jest.fn(),
  query: () => ({}),
  where: () => ({}),
  orderBy: () => ({}),
}));

import { handleStripeWebhookEvent } from "@/lib/firebase/orders";

function mockCheckoutSessionCompleted(items: { productId: string; quantity: number }[]): Stripe.Event {
  return {
    id: "evt_1",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_1",
        metadata: {
          userId: "user_1",
          items: JSON.stringify(
            items.map((i) => ({
              product: { id: i.productId },
              quantity: i.quantity,
              selectedSize: "S",
              selectedColor: "Red",
            }))
          ),
          shippingAddress: JSON.stringify({ street: "123 Main", city: "Boston", state: "MA", zipCode: "02101", country: "US", fullName: "J", id: "a1" }),
        },
        amount_total: 5999,
        payment_status: "paid",
        customer: "cus_1",
      } as Stripe.Checkout.Session,
    },
  } as Stripe.Event;
}

describe("Gap: Webhook inventory deduction", () => {
  beforeEach(() => mockDeductForOrder.mockClear());

  it("handleStripeWebhookEvent calls deductForOrder when checkout.session.completed", async () => {
    const event = mockCheckoutSessionCompleted([
      { productId: "p1", quantity: 2 },
      { productId: "p2", quantity: 1 },
    ]);

    await handleStripeWebhookEvent(event);

    expect(mockDeductForOrder).toHaveBeenCalledWith(expect.any(Array));
    const items = mockDeductForOrder.mock.calls[0][0] as { product: { id: string }; quantity: number }[];
    expect(items.length).toBe(2);
    expect(items.some((i) => i.product?.id === "p1" && i.quantity === 2)).toBe(true);
    expect(items.some((i) => i.product?.id === "p2" && i.quantity === 1)).toBe(true);
  });
});
