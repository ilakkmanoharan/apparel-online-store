import { getStripe } from "@/lib/stripe/server";

export async function getOrCreateStripeCustomerId(userId: string, email?: string): Promise<string> {
  // In production, store stripeCustomerId in Firestore user profile and reuse
  const existingId = process.env.STRIPE_CUSTOMER_ID_MOCK;
  if (existingId) return existingId;
  const customer = await getStripe().customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });
  return customer.id;
}

export async function listPaymentMethods(customerId: string) {
  const methods = await getStripe().paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  return methods.data;
}
