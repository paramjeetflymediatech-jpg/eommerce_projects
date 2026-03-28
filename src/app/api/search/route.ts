import { NextRequest } from "next/server";
import { syncDB, Product, Category } from "@/lib/models";
import { apiResponse, apiError } from "@/lib/utils";
import { Op } from "sequelize";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function GET(req: NextRequest) {
  await ensureDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();
  const limit = parseInt(searchParams.get("limit") || "12");

  if (!q || q.length < 2) return apiError("Query must be at least 2 characters");

  const products = await Product.findAll({
    where: {
      isActive: true,
      [Op.or]: [
        { name: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { shortDescription: { [Op.like]: `%${q}%` } },
      ],
    },
    include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    limit,
    order: [["rating", "DESC"]],
  });

  return apiResponse({ results: products, query: q, count: products.length });
}
