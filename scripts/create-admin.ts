import { User, syncDB } from "../src/lib/models/index";
import bcrypt from "bcryptjs";

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@shopnest.com";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || "System Administrator";

async function createAdmin() {
  console.log("🚀 Initializing database...");
  try {
    await syncDB();
    
    console.log("🔍 Checking for existing admin user...");
    const existingAdmin = await User.findOne({ where: { email: DEFAULT_ADMIN_EMAIL } });

    if (existingAdmin) {
      console.log(`⚠️ Admin user with email ${DEFAULT_ADMIN_EMAIL} already exists.`);
      process.exit(0);
    }

    console.log(`🛠️ Creating admin user: ${DEFAULT_ADMIN_NAME} (${DEFAULT_ADMIN_EMAIL})...`);
    
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

    await User.create({
      name: DEFAULT_ADMIN_NAME,
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: passwordHash,
      role: "ADMIN",
      isVerified: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${DEFAULT_ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log("⚠️  Please change your password after logging in.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdmin();
