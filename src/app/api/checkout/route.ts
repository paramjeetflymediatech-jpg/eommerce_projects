import { NextRequest } from "next/server";
import { syncDB, Product, Order, OrderItem, ProductVariant } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    console.warn("⚠️ [CHECKOUT] Unauthorized access attempt (no session found)");
    return apiError("Unauthorized", 401);
  }

  const body = await req.json();
  const { items, shippingAddress, couponCode, paymentMethod } = body;

  if (!items?.length) return apiError("No items in cart");

  if (!shippingAddress) return apiError("Shipping address is required", 400);

  const requiredFields = ["name", "email", "street", "city", "state", "zip", "phone"];
  for (const field of requiredFields) {
    if (!shippingAddress[field] || shippingAddress[field].trim() === "") {
      return apiError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`, 400);
    }
  }

  if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
    return apiError("Invalid email address", 400);
  }

  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product) return apiError(`Product ${item.productId} not found`);

    let variant = null;
    if (item.variantId) {
      variant = await ProductVariant.findByPk(item.variantId);
      if (!variant) return apiError(`Variant ${item.variantId} not found`);
    }

    const price = variant?.price ?? product.price;
    const itemTotal = Number(price) * item.quantity;
    subtotal += itemTotal;
  }

  let discountAmount = 0;
  let validatedCoupon = null;
  if (couponCode) {
    const { Coupon } = await import("@/lib/models");
    validatedCoupon = await Coupon.findOne({
      where: { code: couponCode.toUpperCase(), isActive: true }
    });

    if (validatedCoupon) {
      const isExpired = validatedCoupon.expiryDate && new Date(validatedCoupon.expiryDate) < new Date();
      const limitReached = validatedCoupon.usageLimit && validatedCoupon.usedCount >= validatedCoupon.usageLimit;
      const minAmountMet = subtotal >= Number(validatedCoupon.minOrderAmount);

      if (!isExpired && !limitReached && minAmountMet) {
        if (validatedCoupon.discountType === "PERCENTAGE") {
          discountAmount = (subtotal * Number(validatedCoupon.discountValue)) / 100;
          if (validatedCoupon.maxDiscountAmount && discountAmount > Number(validatedCoupon.maxDiscountAmount)) {
            discountAmount = Number(validatedCoupon.maxDiscountAmount);
          }
        } else {
          discountAmount = Number(validatedCoupon.discountValue);
        }
        discountAmount = Math.min(discountAmount, subtotal);
      }
    }
  }

  // Free shipping as requested
  const orderTotal = subtotal + 0 + (subtotal * 0.02) + (subtotal * 0.05) - discountAmount;

  try {
    const order = await Order.create({
      userId: Number(session.user.id),
      status: "PENDING",
      total: orderTotal,
      shippingAddress: shippingAddress,
      couponCode: validatedCoupon?.code || undefined,
      discountAmount: discountAmount,
      paymentMethod: paymentMethod || "PHONEPE",
    });

    if (validatedCoupon) {
      await validatedCoupon.increment("usedCount");
    }

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        let variant = null;
        if (item.variantId) {
          variant = await ProductVariant.findByPk(item.variantId);
        }
        
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: Number(variant?.price ?? product.price),
          productName: product.name,
          productImage: product.images?.[0] || undefined,
          variantId: item.variantId || null,
          variantSize: variant?.size || null,
          variantColor: variant?.color || null,
        });
      }
    }

    if (paymentMethod === "COD") {
      return apiResponse({ success: true, orderId: order.id });
    } else {
      // PhonePe V2 Integration using Official SDK
      const { StandardCheckoutClient, Env, StandardCheckoutPayRequest } = require("@phonepe-pg/pg-sdk-node");

      const clientId = process.env.PHONEPE_CLIENT_ID;
      const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
      const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || "1");
      const env = process.env.PHONEPE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX;

      if (!clientId || !clientSecret) {
        return apiError("PhonePe credentials not configured", 500);
      }

      const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

      const merchantTransactionId = `TXN_${Date.now()}_${order.id}`;

      // Store the transaction ID in the order
      await order.update({ stripeSessionId: merchantTransactionId });

       const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const redirectUrl = `${appUrl}/api/payment/phonepe/callback?merchantOrderId=${merchantTransactionId}`;

      const request = StandardCheckoutPayRequest.builder()
        .merchantOrderId(merchantTransactionId)
        .amount(Math.round(orderTotal * 100)) // amount in paise
        .redirectUrl(redirectUrl)
        .build();

      try {
        const response = await client.pay(request);
        
        if (response && response.redirectUrl) {
          return apiResponse({ url: response.redirectUrl });
        } else {
          console.error("PhonePe SDK Response Error:", response);
          return apiError("Failed to get payment URL from PhonePe");
        }
      } catch (sdkError: any) {
        console.error("PhonePe SDK Initiation Error:", sdkError);
        return apiError(`PhonePe Error: ${sdkError.message || "Initiation failed"}`);
      }
    }
  } catch (err) {
    console.error("Failed to create order:", err);
    return apiError("Failed to create order");
  }
}
