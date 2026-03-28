import { NextRequest } from "next/server";
import { syncDB, Category, Product } from "@/lib/models";
import { apiResponse, apiError, slugify } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import sequelize from "@/lib/sequelize";

let dbReady = false;
async function ensureDB() {
  if (!dbReady) { await syncDB(); dbReady = true; }
}

export async function GET() {
  await ensureDB();

  const categories = await Category.findAll({
    where: { parentId: null },
    include: [
      {
        model: Category, as: "children",
        include: [{ model: Category, as: "children" }],
      },
    ],
    order: [["name", "ASC"]],
  });

  // Add product counts
  const counts = await Product.findAll({
    attributes: ["categoryId", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
    where: { isActive: true },
    group: ["categoryId"],
    raw: true,
  }) as unknown as { categoryId: number; count: string }[];

  const countMap = Object.fromEntries(counts.map((c) => [c.categoryId, parseInt(c.count)]));

  return apiResponse({ categories, productCounts: countMap });
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return apiError("Unauthorized", 401);

  const body = await req.json();
  const { name, description, image, parentId } = body;
  if (!name) return apiError("Name is required");

  const slug = slugify(name);
  const existing = await Category.findOne({ where: { slug } });
  if (existing) return apiError("Category with this name already exists");

  const category = await Category.create({ name, slug, description, image, parentId: parentId || null });
  return apiResponse(category, 201);
}
