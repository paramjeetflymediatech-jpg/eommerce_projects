import { ensureDB, Order } from "../src/lib/models";
import crypto from "crypto";

async function populateTrackingIds() {
  console.log("🚀 Starting trackingId population...");
  await ensureDB();
  
  const orders = await Order.findAll({
    where: {
      trackingId: null
    } as any
  });

  console.log(`📦 Found ${orders.length} orders without trackingId.`);

  for (const order of orders) {
    const uuid = crypto.randomUUID();
    await order.update({ trackingId: uuid });
    console.log(`✅ Updated Order #${order.id} with trackingId: ${uuid}`);
  }

  console.log("✨ Done!");
  process.exit(0);
}

populateTrackingIds().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
