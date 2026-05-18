import Stripe from "stripe";

declare global {
  var __vibrantPawsStripe__: Stripe | undefined;
}

export function getStripeServerClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
  }

  if (!globalThis.__vibrantPawsStripe__) {
    globalThis.__vibrantPawsStripe__ = new Stripe(secretKey);
  }

  return globalThis.__vibrantPawsStripe__;
}