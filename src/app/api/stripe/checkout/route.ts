import { NextRequest } from "next/server";
import stripe from "@/lib/stripe";
import { syncDB, Product } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const { items, shippingAddress } = body;

  if (!items?.length) return apiError("No items in cart");

  const lineItems = [];
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) return apiError(`Product ${item.productId} not found`);

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: product.images?.slice(0, 1).map((img: string) =>
            img.startsWith("http") ? img : `${process.env.NEXT_PUBLIC_APP_URL}${img}`
          ) || [],
        },
        unit_amount: Math.round(Number(product.price) * 100),
      },
      quantity: item.quantity,
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      userId: session.user.id,
      shippingAddress: JSON.stringify(shippingAddress),
      items: JSON.stringify(items),
    },
  });

  return apiResponse({ url: checkoutSession.url, sessionId: checkoutSession.id });
}
