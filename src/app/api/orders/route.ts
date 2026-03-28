import { NextRequest } from "next/server";
import { syncDB, Order, OrderItem, Product, User } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (session.user.role !== "ADMIN") {
    where.userId = parseInt(session.user.id);
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    include: [
      { model: OrderItem, as: "items" },
      { model: User, as: "user", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return apiResponse({ orders: rows, total: count, page, limit });
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const { items, shippingAddress, stripePaymentId, stripeSessionId } = body;

  if (!items?.length || !shippingAddress) {
    return apiError("items and shippingAddress are required");
  }

  // Calculate total from DB prices (not client-side)
  let total = 0;
  const orderItems: {
    productId: number; quantity: number;
    priceAtPurchase: number; productName: string; productImage?: string;
  }[] = [];

  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) return apiError(`Product ${item.productId} not found`, 404);
    total += Number(product.price) * item.quantity;
    orderItems.push({
      productId: product.id,
      quantity: item.quantity,
      priceAtPurchase: Number(product.price),
      productName: product.name,
      productImage: product.images?.[0],
    });
  }

  const order = await Order.create({
    userId: parseInt(session.user.id),
    total,
    shippingAddress,
    stripePaymentId,
    stripeSessionId,
    status: "PENDING",
  });

  await OrderItem.bulkCreate(orderItems.map((i) => ({ ...i, orderId: order.id })));

  return apiResponse(order, 201);
}
