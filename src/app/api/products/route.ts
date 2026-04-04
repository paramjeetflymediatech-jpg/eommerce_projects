import { NextRequest } from "next/server";
import { Product, Category, ensureDB } from "@/lib/models";
import { apiResponse, apiError, slugify, getPaginationMeta } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Op } from "sequelize";


export async function GET(req: NextRequest) {
  try {
    await ensureDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt_desc";
    const featured = searchParams.get("featured");

    const where: any = { isActive: true };
    if (category) {
      // Recursive category filtering: include all child categories
      const allSubcategories = await Category.findAll({
        attributes: ["id"],
        where: { [Op.or]: [{ id: category }, { parentId: category }] },
        raw: true
      });
      // For deeper nesting, we'd need a recursive CTE or multiple lookups, 
      // but for "3 levels" as requested, we handle parents and immediate children here.
      // Let's implement a more robust version:
      const categoryIds = [parseInt(category)];
      
      const getChildIds = async (pId: number) => {
        const children = await Category.findAll({ where: { parentId: pId }, attributes: ["id"], raw: true });
        for (const child of children) {
          categoryIds.push(child.id);
          await getChildIds(child.id); // Recurse
        }
      };

      await getChildIds(parseInt(category));
      where.categoryId = { [Op.in]: categoryIds };
    }
    if (featured === "true") where.isFeatured = true;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
      limit,
      offset,
      order: sort === "price_asc" ? [["price", "ASC"]] : sort === "price_desc" ? [["price", "DESC"]] : [["createdAt", "DESC"]],
    });


    return apiResponse({ products: rows, pagination: getPaginationMeta(count, page, limit) });
  } catch (err: any) {
    console.error("Products GET error:", err);
    return apiError("Internal server error", 500);
  }
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
