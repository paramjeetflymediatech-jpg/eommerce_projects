import { NextRequest } from "next/server";
import { ensureDB, User, Product, Category, Migration } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import bcrypt from "bcryptjs";

// GET /api/admin/seed — creates admin user + seeds demo data + logs migration
export async function GET(req: NextRequest) {
  await ensureDB();

  try {
    const results: string[] = [];

    // ── 1. Migration: Add isVerified, otp, otpExpiry to users ────────────────
    const m1 = "001_add_otp_fields_to_users";
    const exists1 = await Migration.findOne({ where: { name: m1 } });
    if (!exists1) {
      await Migration.create({ name: m1 });
      results.push(`✅ Migration applied: ${m1}`);
    } else {
      results.push(`⏭ Already applied: ${m1}`);
    }

    // ── 2. Migration: Add role ENUM to users ──────────────────────────────────
    const m2 = "002_add_role_to_users";
    const exists2 = await Migration.findOne({ where: { name: m2 } });
    if (!exists2) {
      await Migration.create({ name: m2 });
      results.push(`✅ Migration applied: ${m2}`);
    } else {
      results.push(`⏭ Already applied: ${m2}`);
    }

    // ── 3. Migration: Add token field to users ────────────────────────────────
    const m3 = "003_add_token_field_to_users";
    const exists3 = await Migration.findOne({ where: { name: m3 } });
    if (!exists3) {
      await Migration.create({ name: m3 });
      results.push(`✅ Migration applied: ${m3}`);
    } else {
      results.push(`⏭ Already applied: ${m3}`);
    }

    // ── 4. Create Admin User ──────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || "admin@shopnest.com";
    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash("admin123", 12);
      await User.create({
        name: "ShopNest Admin",
        email: adminEmail,
        passwordHash,
        role: "ADMIN",
        isVerified: true,
      });
      results.push(`✅ Admin user created: ${adminEmail} / admin123`);
    } else {
      await existingAdmin.update({ role: "ADMIN", isVerified: true });
      results.push(`⏭ Admin user already exists: ${adminEmail} — role + verified ensured`);
    }

    // ── 5. Seed Categories (if empty) ─────────────────────────────────────────
    const catCount = await Category.count();
    if (catCount === 0) {
      await Category.bulkCreate([
        { name: "Sofas", slug: "sofas", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80" },
        { name: "Lighting", slug: "lighting", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80" },
        { name: "Dining", slug: "dining", image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80" },
        { name: "Art & Decor", slug: "decor", image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80" },
      ]);
      results.push("✅ Categories seeded");
    } else {
      results.push(`⏭ Categories already exist (${catCount} found)`);
    }

    return apiResponse({ success: true, results });
  } catch (err: any) {
    console.error("Seed error:", err);
    return apiError(err.message, 500);
  }
}
