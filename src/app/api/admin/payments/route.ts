import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Order, User } from "@/lib/models";
import { apiResponse, apiError, getPaginationMeta } from "@/lib/utils";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const offset = (page - 1) * limit;
  const paymentMethod = searchParams.get("paymentMethod");

  const where: any = {};
  if (paymentMethod && paymentMethod !== "ALL") {
    where.paymentMethod = paymentMethod;
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      { model: User, as: "user", attributes: ["id", "name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  const totalAmount = await Order.sum('total', { where });

  return apiResponse({
    payments: rows,
    totalAmount: totalAmount || 0,
    pagination: getPaginationMeta(count, page, limit),
  });
}
