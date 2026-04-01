import { NextRequest } from "next/server";
import stripe from "@/lib/stripe";
import { syncDB, Product, Order, OrderItem } from "@/lib/models";
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
  if (!session) {
    console.warn("⚠️ [STRIPE_CHECKOUT] Unauthorized access attempt (no session found)");
    return apiError("Unauthorized", 401);
  }

  const body = await req.json();
  const { items, shippingAddress } = body;

  if (!items?.length) return apiError("No items in cart");

  // Fetch products and build line items
  const lineItems = [];
  let orderTotal = 0;

  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) return apiError(`Product ${item.productId} not found`);

    const itemTotal = Number(product.price) * item.quantity;
    orderTotal += itemTotal;

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

  // Create Stripe checkout session
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

  // ─── Create Order in DB immediately so it appears in admin ───────
  try {
    const order = await Order.create({
      userId: Number(session.user.id),
      status: "PENDING",
      total: orderTotal,
      shippingAddress: shippingAddress,
      stripeSessionId: checkoutSession.id,
    });

    // Create OrderItems
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: Number(product.price),
          productName: product.name,
          productImage: product.images?.[0] || undefined,
        });
      }
    }
  } catch (err) {
    console.error("Failed to create order in DB:", err);
    // Don't block the checkout even if DB save fails
  }

  return apiResponse({ url: checkoutSession.url, sessionId: checkoutSession.id });
}
