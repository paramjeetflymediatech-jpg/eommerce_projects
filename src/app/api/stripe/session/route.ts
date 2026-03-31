import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json({
      email: session.customer_details?.email,
      name: session.customer_details?.name,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
    });
  } catch (err: any) {
    console.error("Stripe session fetch error:", err.message);
    return NextResponse.json({ error: "Could not retrieve session" }, { status: 500 });
  }
}
