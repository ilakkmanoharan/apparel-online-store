import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  throw new Error(
    "[Stripe] STRIPE_SECRET_KEY is not set. Add it to your .env file. " +
      "You can find it in the Stripe Dashboard → Developers → API keys."
  );
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

