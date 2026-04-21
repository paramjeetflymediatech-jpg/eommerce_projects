import { NextRequest } from "next/server";
import { ensureDB, Coupon } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  await ensureDB();

  const body = await req.json();
  const { code, subtotal } = body;

  if (!code) return apiError("Coupon code is required", 400);
  if (subtotal === undefined) return apiError("Subtotal is required to validate coupon", 400);

  const coupon = await Coupon.findOne({
    where: { 
      code: code.toUpperCase(),
      isActive: true,
    }
  });

  if (!coupon) {
    return apiError("Invalid or inactive coupon code", 404);
  }

  // Check expiry
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    return apiError("Coupon has expired", 400);
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return apiError("Coupon usage limit reached", 400);
  }

  // Check minimum order amount
  if (subtotal < Number(coupon.minOrderAmount)) {
    return apiError(`Minimum order amount for this coupon is $${coupon.minOrderAmount}`, 400);
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    discountAmount = (subtotal * Number(coupon.discountValue)) / 100;
    if (coupon.maxDiscountAmount && discountAmount > Number(coupon.maxDiscountAmount)) {
      discountAmount = Number(coupon.maxDiscountAmount);
    }
  } else {
    discountAmount = Number(coupon.discountValue);
  }

  // Discount cannot exceed subtotal
  discountAmount = Math.min(discountAmount, subtotal);

  return apiResponse({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
  });
}
