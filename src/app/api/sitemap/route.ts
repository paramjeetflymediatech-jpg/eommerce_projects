import { syncDB, Product, Category } from "@/lib/models";
import { apiResponse } from "@/lib/utils";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function GET() {
  await ensureDB();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const products = await Product.findAll({
    where: { isActive: true },
    attributes: ["slug"],
    raw: true,
  });

  const categories = await Category.findAll({
    attributes: ["slug"],
    raw: true,
  });

  const paths = [
    ...products.map((p: { slug: string }) => `${appUrl}/products/${p.slug}`),
    ...categories.map((c: { slug: string }) => `${appUrl}/categories/${c.slug}`),
  ];

  return apiResponse(paths);
}
