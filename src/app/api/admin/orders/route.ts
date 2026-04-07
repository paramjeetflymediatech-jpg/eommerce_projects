import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Order, User, OrderItem, Product } from "@/lib/models";
import { apiResponse, apiError, getPaginationMeta } from "@/lib/utils";
import { sendOrderStatusUpdateEmail } from "@/lib/mailer";
import { Op } from "sequelize";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/orders — list all orders (admin only)
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") || "20"));
  const offset = (page - 1) * limit;
  const status = searchParams.get("status");

  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      { model: User, as: "user", attributes: ["id", "name", "email"] },
      { 
        model: OrderItem, 
        as: "items", 
        include: [{ model: Product, as: "product", attributes: ["id", "name", "images"] }]
      }
    ],
    order: [["createdAt", "DESC"]],
    distinct: true, // Crucial for count when including associations
  });

  return apiResponse({
    orders: rows,
    pagination: getPaginationMeta(count, page, limit),
  });
}

// PATCH /api/admin/orders — update order status
export async function PATCH(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { id, status, trackingId, carrier, shippingAddress } = await req.json();
    if (!id || !status) return apiError("Order ID and status are required");

    const order = await Order.findByPk(id, {
      include: [{ model: User, as: "user", attributes: ["email", "name"] }]
    });
    if (!order) return apiError("Order not found", 404);

    order.status = status;
    if (trackingId !== undefined) order.trackingId = trackingId;
    if (carrier !== undefined) order.carrier = carrier;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    await order.save();

    // Trigger Email Notification
    if (order.user?.email) {
      try {
        await sendOrderStatusUpdateEmail(order.user.email, {
          customerName: order.user.name || "Customer",
          orderNumber: order.id.toString().padStart(6, "0"),
          orderId: order.id,
          status: order.status,
          trackingId: order.trackingId,
          carrier: order.carrier,
        });
      } catch (emailError) {
        console.error("Failed to send order update email:", emailError);
      }
    }

    return apiResponse({ order });
  } catch (error) {
    console.error("Order update error:", error);
    return apiError("Failed to update order");
  }
}

// DELETE /api/admin/orders — delete an order
export async function DELETE(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return apiError("Order ID required", 400);

    const order = await Order.findByPk(id);
    if (!order) return apiError("Order not found", 404);

    // Delete associated order items to avoid foreign key constraints
    await OrderItem.destroy({ where: { orderId: id } });
    
    // Delete the order
    await order.destroy();

    return apiResponse({ success: true });
  } catch (error) {
    console.error("Order deletion error:", error);
    return apiError("Failed to delete order");
  }
}
