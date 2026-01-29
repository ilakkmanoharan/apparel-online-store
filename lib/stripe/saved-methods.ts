import { stripe } from "@/lib/stripe/server";
import type { PaymentMethod } from "@/types/payment";

export async function getSavedPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
  const methods = await stripe.paymentMethods.list({
    customer: customerId,
    type: "card",
  });
  return methods.data.map((pm) => ({
    id: pm.id,
    userId: "",
    type: "card" as const,
    last4: pm.card?.last4,
    brand: pm.card?.brand,
    expiryMonth: pm.card?.exp_month ?? undefined,
    expiryYear: pm.card?.exp_year ?? undefined,
    isDefault: false,
    stripePaymentMethodId: pm.id,
    createdAt: new Date(),
  }));
}
