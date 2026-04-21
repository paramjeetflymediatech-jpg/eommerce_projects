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

// GET /api/admin/coupons — list all coupons (admin only)
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const coupons = await Coupon.findAll({
    order: [["createdAt", "DESC"]],
  });

  return apiResponse({ coupons });
}

// POST /api/admin/coupons — create coupon (admin only)
export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const { 
    code, 
    description, 
    discountType, 
    discountValue, 
    minOrderAmount, 
    maxDiscountAmount, 
    expiryDate, 
    usageLimit, 
    isActive 
  } = body;

  if (!code || !discountType || discountValue === undefined) {
    return apiError("code, discountType, and discountValue are required");
  }

  const existing = await Coupon.findOne({ where: { code: code.toUpperCase() } });
  if (existing) return apiError("A coupon with this code already exists");

  try {
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxDiscountAmount: maxDiscountAmount ? parseFloat(maxDiscountAmount) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      isActive: isActive !== undefined ? isActive : true,
      usedCount: 0,
    });

    return apiResponse({ coupon }, 201);
  } catch (error) {
    console.error("Coupon creation error:", error);
    return apiError("Failed to create coupon");
  }
}

// DELETE /api/admin/coupons — delete coupon (admin only)
// Note: In Next.js App Router, you'd usually use a dynamic route [id]/route.ts for DELETE.
// But for simplicity, we can use searchParams or just create the dynamic route.
// I'll create the dynamic route next.
