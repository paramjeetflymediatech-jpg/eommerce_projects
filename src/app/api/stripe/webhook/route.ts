import { NextRequest } from "next/server";
import stripe from "@/lib/stripe";
import { syncDB, Order, OrderItem, Product } from "@/lib/models";
import { apiError } from "@/lib/utils";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    return new Response(`Webhook error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as unknown as {
      id: string;
      payment_intent: string;
      metadata: { userId: string; shippingAddress: string; items: string };
    };

    const { userId, shippingAddress, items } = session.metadata;
    const parsedItems: { productId: number; quantity: number }[] = JSON.parse(items);

    let total = 0;
    const orderItems = [];
    for (const item of parsedItems) {
      const product = await Product.findByPk(item.productId);
      if (!product) continue;
      const lineTotal = Number(product.price) * item.quantity;
      total += lineTotal;
      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: Number(product.price),
        productName: product.name,
        productImage: product.images?.[0],
      });
      // Reduce stock
      await product.update({ stock: Math.max(0, product.stock - item.quantity) });
    }

    const order = await Order.create({
      userId: parseInt(userId),
      total,
      shippingAddress: JSON.parse(shippingAddress),
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      status: "PROCESSING",
    });

    await OrderItem.bulkCreate(orderItems.map((i) => ({ ...i, orderId: order.id })));
  }

  return new Response("ok", { status: 200 });
}
