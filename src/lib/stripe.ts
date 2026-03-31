import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  console.warn("⚠️  STRIPE_SECRET_KEY is not set in .env — payments will fail.");
}

const stripe = new Stripe(key ?? "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia",
});

export default stripe;
