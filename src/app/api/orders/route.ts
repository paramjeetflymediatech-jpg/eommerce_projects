import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Order, OrderItem, Product } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

// GET /api/orders — list orders for the logged-in user
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session) return apiError("Unauthorized", 401);

  const userId = Number((session as any).user.id);

  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: OrderItem,
        as: "items",
        include: [{ model: Product, as: "product", attributes: ["id", "name", "images"] }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return apiResponse({ orders });
}
