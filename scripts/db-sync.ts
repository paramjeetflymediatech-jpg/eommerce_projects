/**
 * db-sync.ts
 * Syncs all Sequelize models to the MySQL database using `alter: true`.
 * This adds new columns / indexes but does NOT drop existing ones.
 *
 * Usage:  npm run db:sync
 */

import {
  syncDB,
  sequelize,
  User,
  Category,
  Product,
  ProductVariant,
  Order,
  OrderItem,
  Review,
  Cart,
  CartItem,
  Address,
  WishlistItem,
  Migration,
} from "../src/lib/models/index";

const models = [
  { name: "Users",           model: User },
  { name: "Categories",      model: Category },
  { name: "Products",        model: Product },
  { name: "ProductVariants", model: ProductVariant },
  { name: "Orders",          model: Order },
  { name: "OrderItems",      model: OrderItem },
  { name: "Reviews",         model: Review },
  { name: "Carts",           model: Cart },
  { name: "CartItems",       model: CartItem },
  { name: "Addresses",       model: Address },
  { name: "WishlistItems",   model: WishlistItem },
  { name: "Migrations",      model: Migration },
];

async function runSync() {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  🛠  Aion Luxury — Database Schema Sync");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  try {
    // 1. Authenticate
    console.log("🔌 Connecting to MySQL...");
    await sequelize.authenticate();
    const cfg = sequelize.config as any;
    console.log(`✅ Connected → ${cfg.database}@${cfg.host}:${cfg.port || 3306}\n`);

    // 2. Sync all models (alter = safe: adds/changes columns, never drops)
    console.log("🔄 Syncing schema (alter: true — non-destructive)...\n");
    await sequelize.sync({ alter: true });

    // 3. Verify each table exists and show row count
    console.log("📋 Table status:\n");
    for (const { name, model } of models) {
      try {
        const count = await (model as any).count();
        const bar = count > 0 ? `(${count} rows)` : "(empty)";
        console.log(`   ✅  ${name.padEnd(18)} ${bar}`);
      } catch (e: any) {
        console.log(`   ⚠️  ${name.padEnd(18)} — error: ${e.message}`);
      }
    }

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ✨ Sync complete — schema is up to date.");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Sync failed:", error.message || error);
    if (error.original) console.error("   DB error:", error.original.message);
    process.exit(1);
  }
}

runSync();
