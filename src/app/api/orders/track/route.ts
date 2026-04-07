import { NextRequest } from "next/server";
import { ensureDB, Order, OrderItem, Product } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const trackingId = searchParams.get("trackingId");

    if (!id && !trackingId) {
      return apiError("Order ID or Tracking ID is required", 400);
    }

    const where: any = {};
    if (id) {
      // Handle both numeric and padded string IDs
      const numericId = parseInt(id.replace(/^0+/, ""));
      where.id = numericId || id;
    } else if (trackingId) {
      where.trackingId = trackingId;
    }

    const order = await Order.findOne({
      where,
      attributes: ["id", "status", "trackingId", "carrier", "createdAt", "updatedAt"],
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product", attributes: ["name", "images"] }],
        },
      ],
    });

    if (!order) {
      return apiError("Order not found", 404);
    }

    return apiResponse({ order });
  } catch (error) {
    console.error("Order tracking API error:", error);
    return apiError("Internal server error");
  }
}
