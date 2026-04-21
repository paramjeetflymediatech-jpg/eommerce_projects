import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Coupon } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const coupon = await Coupon.findByPk(resolvedParams.id);
  if (!coupon) return apiError("Coupon not found", 404);

  return apiResponse({ coupon });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const coupon = await Coupon.findByPk(resolvedParams.id);
  if (!coupon) return apiError("Coupon not found", 404);

  try {
    if (body.code) body.code = body.code.toUpperCase();
    await coupon.update(body);
    return apiResponse({ coupon });
  } catch (error) {
    console.error("Coupon update error:", error);
    return apiError("Failed to update coupon");
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const coupon = await Coupon.findByPk(resolvedParams.id);
  if (!coupon) return apiError("Coupon not found", 404);

  try {
    await coupon.destroy();
    return apiResponse({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Coupon deletion error:", error);
    return apiError("Failed to delete coupon");
  }
}
