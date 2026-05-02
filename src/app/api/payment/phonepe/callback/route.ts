import { NextRequest, NextResponse } from "next/server";
import { syncDB, Order } from "@/lib/models";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

async function handleCallback(req: NextRequest, isGet: boolean) {
  await ensureDB();
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin).replace(/\/$/, "");

  try {
    let transactionId: string | null = null;
    let merchantId: string | null = null;

    if (isGet) {
      const searchParams = req.nextUrl.searchParams;
      transactionId = searchParams.get("transactionId") || searchParams.get("merchantOrderId");
      merchantId = searchParams.get("merchantId");
    } else {
      const body = await req.text();
      const formData = new URLSearchParams(body);
      transactionId = formData.get("transactionId") || formData.get("merchantOrderId");
      merchantId = formData.get("merchantId");
    }

    // PhonePe V2 Integration using Official SDK
    const { StandardCheckoutClient, Env } = require("@phonepe-pg/pg-sdk-node");
    
    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = parseInt(process.env.PHONEPE_CLIENT_VERSION || "1");
    const env = process.env.PHONEPE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX;

    if (!clientId || !clientSecret) {
      console.error("PhonePe credentials missing in callback");
      return NextResponse.redirect(`${appUrl}/checkout?failed=true`);
    }

    const client = StandardCheckoutClient.getInstance(clientId, clientSecret, clientVersion, env);

    if (transactionId) {
      try {
        const response = await client.getOrderStatus(transactionId);
        const order = await Order.findOne({ where: { stripeSessionId: transactionId } });
        
        if (order) {
          if (response && response.state === "COMPLETED") {
            await order.update({ 
              status: "PROCESSING", 
              stripePaymentId: response.transactionId || transactionId
            });
            // Redirect to success page with orderId
            return NextResponse.redirect(`${appUrl}/checkout/success?orderId=${order.id}`);
          } else {
            console.warn("PhonePe Payment not completed:", response);
            await order.update({ status: "CANCELLED" });
            return NextResponse.redirect(`${appUrl}/checkout/failed`);
          }
        }
      } catch (sdkError: any) {
        console.error("PhonePe SDK Status Check Error:", sdkError);
      }
    }
    
    return NextResponse.redirect(`${appUrl}/checkout/failed`);
  } catch (err) {
    console.error("PhonePe callback error:", err);
    return NextResponse.redirect(`${appUrl}/checkout/failed`);
  }
}

export async function POST(req: NextRequest) {
  return handleCallback(req, false);
}

export async function GET(req: NextRequest) {
  return handleCallback(req, true);
}
