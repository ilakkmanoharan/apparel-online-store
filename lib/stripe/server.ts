import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

/**
 * Lazy Stripe client so `next build` can typecheck/route-collect without STRIPE_SECRET_KEY.
 * Throws when a route actually calls Stripe without the env var set.
 */
export function getStripe(): Stripe {
  if (!stripeSingleton) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error(
        "[Stripe] STRIPE_SECRET_KEY is not set. Add it to your .env file. " +
          "You can find it in the Stripe Dashboard → Developers → API keys."
      );
    }
    stripeSingleton = new Stripe(key, {
      apiVersion: "2023-10-16",
    });
  }
  return stripeSingleton;
}
