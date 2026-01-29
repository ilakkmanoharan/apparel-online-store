import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe() {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      throw new Error(
        "[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. " +
          "Add it to your .env file from Stripe Dashboard → Developers → API keys."
      );
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

