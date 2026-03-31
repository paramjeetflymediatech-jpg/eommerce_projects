import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureDB, Product, Category } from "@/lib/models";
import { apiResponse, apiError, getPaginationMeta, slugify } from "@/lib/utils";

async function requireAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }
  return session;
}

// GET /api/admin/products — list all products (admin only)
export async function GET(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const offset = (page - 1) * limit;

  const { count, rows } = await Product.findAndCountAll({
    limit,
    offset,
    include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  });

  return apiResponse({
    products: rows,
    pagination: getPaginationMeta(count, page, limit),
  });
}

// POST /api/admin/products — create product (admin only)
export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await requireAdmin(req);
  if (!session) return apiError("Unauthorized", 401);

  const body = await req.json();
  const { name, description, price, comparePrice, stock, categoryId, images, isFeatured, slug } = body;

  if (!name || !price || !categoryId) {
    return apiError("name, price, and categoryId are required");
  }

  const generatedSlug = slugify(slug || name);

  const existing = await Product.findOne({ where: { slug: generatedSlug } });
  if (existing) return apiError("A product with this slug already exists");

  const product = await Product.create({
    name,
    slug: generatedSlug,
    description: description || "",
    price: parseFloat(price),
    comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
    stock: parseInt(stock) || 0,
    categoryId: parseInt(categoryId),
    images: images || [],
    isFeatured: isFeatured || false,
    rating: 0,
    reviewCount: 0,
  });

  return apiResponse({ product }, 201);
}
