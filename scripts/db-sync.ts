import { syncDB } from "../src/lib/models/index";

async function runSync() {
  console.log("🚀 Starting database synchronization...");
  try {
    // Ensure you run this with node --env-file=.env or tsx --env-file=.env
    await syncDB();
    console.log("✅ Database synchronization completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database synchronization failed:", error);
    process.exit(1);
  }
}

runSync();
