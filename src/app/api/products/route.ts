import { NextRequest } from "next/server";
import { syncDB, Product, Category } from "@/lib/models";
import { apiResponse, apiError, slugify, getPaginationMeta } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Op } from "sequelize";

// Ensure DB is synced
let dbReady = false;
async function ensureDB() {
  if (!dbReady) {
    await syncDB();
    dbReady = true;
  }
}

export async function GET(req: NextRequest) {
  await ensureDB();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = (page - 1) * limit;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "createdAt_desc";
  const featured = searchParams.get("featured");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where: Record<string, unknown> = { isActive: true };

  if (category) where.categoryId = category;
  if (featured === "true") where.isFeatured = true;
  if (search) {
    where[Op.or as unknown as string] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, number> = {};
    if (minPrice) priceFilter[Op.gte as unknown as string] = parseFloat(minPrice);
    if (maxPrice) priceFilter[Op.lte as unknown as string] = parseFloat(maxPrice);
    where.price = priceFilter;
  }

  const [field, direction] = sort.split("_");
  const order: [string, string][] = [[field === "price" ? "price" : "createdAt", direction?.toUpperCase() === "ASC" ? "ASC" : "DESC"]];

  const { count, rows } = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    order,
    limit,
    offset,
  });

  return apiResponse({ products: rows, pagination: getPaginationMeta(count, page, limit) });
}

export async function POST(req: NextRequest) {
  await ensureDB();
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return apiError("Unauthorized", 401);

  const body = await req.json();
  const { name, description, shortDescription, price, comparePrice, stock, categoryId, tags, isFeatured, images } = body;

  if (!name || !description || !price || !categoryId) {
    return apiError("Missing required fields: name, description, price, categoryId");
  }

  const slug = slugify(name) + "-" + Date.now();
  const product = await Product.create({
    name, slug, description, shortDescription, price: parseFloat(price),
    comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
    stock: parseInt(stock) || 0,
    categoryId: parseInt(categoryId),
    tags: tags || [],
    isFeatured: isFeatured || false,
    images: images || [],
  });

  return apiResponse(product, 201);
}
